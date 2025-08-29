<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileManagerController extends Controller
{
    public function index(Request $request)
    {
        $path = $request->input('path', 'upload');
        $tree = $request->input('tree', false);
        
        if ($tree) {
            $folders = $this->getAllFoldersTree();
            return response()->json([
                'folders' => $folders
            ]);
        }
        
        $files = $this->getFiles($path);
        $folders = $this->getFolders($path);
        $breadcrumbs = $this->getBreadcrumbs($path);
        
        return response()->json([
            'files' => $files,
            'folders' => $folders,
            'breadcrumbs' => $breadcrumbs,
            'currentPath' => $path
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp,pdf,doc,docx|max:5120',
            'path' => 'nullable|string'
        ]);

        $uploadPath = $request->input('path', 'upload/userfiles');

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            
            // Tạo tên file từ tên gốc
            $baseName = $this->generateFileName($originalName);
            $fileName = $this->getUniqueFileName($baseName, $extension, $uploadPath);
            
            // Lưu file vào path được chỉ định
            $path = Storage::disk('public')->putFileAs(
                $uploadPath,
                $file,
                basename($fileName)
            );

            if ($path) {
                $url = Storage::disk('public')->url($path);
                
                return response()->json([
                    'success' => true,
                    'file' => [
                        'name' => basename($fileName),
                        'url' => $url,
                        'path' => $path,
                        'size' => $file->getSize(),
                        'type' => $file->getMimeType(),
                        'extension' => $extension
                    ]
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Upload failed'
        ], 400);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
            'type' => 'required|in:file,folder'
        ]);

        $path = $request->input('path');
        $type = $request->input('type');

        if ($type === 'folder') {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->deleteDirectory($path);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Folder deleted successfully'
                ]);
            }
        } else {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
                
                return response()->json([
                    'success' => true,
                    'message' => 'File deleted successfully'
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Item not found'
        ], 404);
    }

    public function createFolder(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'nullable|string'
        ]);

        $parentPath = $request->input('path', 'upload/userfiles');
        $folderName = $this->generateFileName($request->input('name'));
        $folderPath = $parentPath . '/' . $folderName;

        if (Storage::disk('public')->exists($folderPath)) {
            return response()->json([
                'success' => false,
                'message' => 'Folder already exists'
            ], 400);
        }

        Storage::disk('public')->makeDirectory($folderPath);

        return response()->json([
            'success' => true,
            'message' => 'Folder created successfully',
            'folder' => [
                'name' => $folderName,
                'path' => $folderPath
            ]
        ]);
    }

    public function rename(Request $request)
    {
        $request->validate([
            'oldPath' => 'required|string',
            'newName' => 'required|string|max:255'
        ]);

        $oldPath = $request->input('oldPath');
        $newName = $this->generateFileName($request->input('newName'));
        $newPath = dirname($oldPath) . '/' . $newName;

        if (Storage::disk('public')->exists($newPath)) {
            return response()->json([
                'success' => false,
                'message' => 'Name already exists'
            ], 400);
        }

        if (Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->move($oldPath, $newPath);
            
            return response()->json([
                'success' => true,
                'message' => 'Renamed successfully',
                'newPath' => $newPath
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Item not found'
        ], 404);
    }

    private function getFiles($path)
    {
        $files = [];
        
        if (Storage::disk('public')->exists($path)) {
            $fileList = Storage::disk('public')->files($path);
            
            foreach ($fileList as $file) {
                $filename = basename($file);
                $url = Storage::disk('public')->url($file);
                $size = Storage::disk('public')->size($file);
                $mimeType = Storage::disk('public')->mimeType($file);
                
                $files[] = [
                    'name' => $filename,
                    'url' => $url,
                    'path' => $file,
                    'size' => $size,
                    'type' => $mimeType,
                    'extension' => pathinfo($filename, PATHINFO_EXTENSION),
                    'isImage' => str_starts_with($mimeType, 'image/'),
                    'uploaded_at' => Storage::disk('public')->lastModified($file)
                ];
            }
        }

        // Sắp xếp theo thời gian upload mới nhất
        usort($files, function($a, $b) {
            return $b['uploaded_at'] - $a['uploaded_at'];
        });

        return $files;
    }

    private function getFolders($path)
    {
        $folders = [];
        
        if (Storage::disk('public')->exists($path)) {
            $folderList = Storage::disk('public')->directories($path);
            
            foreach ($folderList as $folder) {
                $folderName = basename($folder);
                $itemCount = count(Storage::disk('public')->files($folder)) + count(Storage::disk('public')->directories($folder));
                
                $folders[] = [
                    'name' => $folderName,
                    'path' => $folder,
                    'itemCount' => $itemCount,
                    'created_at' => Storage::disk('public')->lastModified($folder)
                ];
            }
        }

        // Sắp xếp theo tên
        usort($folders, function($a, $b) {
            return strcasecmp($a['name'], $b['name']);
        });

        return $folders;
    }

    private function getBreadcrumbs($path)
    {
        $breadcrumbs = [];
        $pathParts = explode('/', $path);
        $currentPath = '';
        
        foreach ($pathParts as $part) {
            if ($part) {
                $currentPath .= ($currentPath ? '/' : '') . $part;
                $breadcrumbs[] = [
                    'name' => $part,
                    'path' => $currentPath
                ];
            }
        }
        
        return $breadcrumbs;
    }

    private function generateFileName(string $originalName): string
    {
        $nameWithoutExt = pathinfo($originalName, PATHINFO_FILENAME);
        $slug = Str::slug($nameWithoutExt);
        
        if (strlen($slug) > 50) {
            $slug = substr($slug, 0, 50);
        }
        
        return $slug ?: 'file';
    }

    private function getUniqueFileName(string $baseName, string $extension, string $path): string
    {
        $counter = 0;
        $fileName = "{$path}/{$baseName}.{$extension}";
        
        while (Storage::disk('public')->exists($fileName)) {
            $counter++;
            $fileName = "{$path}/{$baseName}-{$counter}.{$extension}";
        }
        
        return $fileName;
    }

    private function getAllFoldersTree()
    {
        $rootPath = 'upload/userfiles';
        $folders = $this->buildFolderTree($rootPath);
        
        // Thêm thư mục root userfiles
        $rootFolder = [
            'name' => 'userfiles',
            'path' => $rootPath,
            'itemCount' => count(Storage::disk('public')->files($rootPath)) + count(Storage::disk('public')->directories($rootPath)),
            'created_at' => time(),
            'isExpanded' => true,
            'children' => $folders
        ];
        
        return [$rootFolder];
    }

    private function buildFolderTree($path, $level = 0)
    {
        $folders = [];
        
        if (Storage::disk('public')->exists($path)) {
            $folderList = Storage::disk('public')->directories($path);
            
            foreach ($folderList as $folder) {
                $folderName = basename($folder);
                $itemCount = count(Storage::disk('public')->files($folder)) + count(Storage::disk('public')->directories($folder));
                
                $folderData = [
                    'name' => $folderName,
                    'path' => $folder,
                    'itemCount' => $itemCount,
                    'created_at' => Storage::disk('public')->lastModified($folder),
                    'isExpanded' => false
                ];
                
                // Recursively get children
                $children = $this->buildFolderTree($folder, $level + 1);
                if (!empty($children)) {
                    $folderData['children'] = $children;
                }
                
                $folders[] = $folderData;
            }
        }

        // Sắp xếp theo tên
        usort($folders, function($a, $b) {
            return strcasecmp($a['name'], $b['name']);
        });

        return $folders;
    }
}
