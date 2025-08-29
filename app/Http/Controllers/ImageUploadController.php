<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'title' => 'nullable|string|max:255'
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // Tạo tên file từ tiêu đề
            $title = $request->input('title', 'image');
            $baseName = $this->generateFileName($title);
            $extension = $file->getClientOriginalExtension();
            
            // Kiểm tra xem file đã tồn tại chưa và thêm số nếu cần
            $fileName = $this->getUniqueFileName($baseName, $extension);
            
            // Lưu file vào storage/app/public
            $path = Storage::disk('public')->putFileAs(
                dirname($fileName),
                $file,
                basename($fileName)
            );

            if ($path) {
                // Trả về URL của ảnh
                $url = Storage::disk('public')->url($path);
                
                return response()->json([
                    'success' => true,
                    'url' => $url,
                    'path' => $path
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Upload failed'
        ], 400);
    }

    /**
     * Tạo tên file từ tiêu đề
     */
    private function generateFileName(string $title): string
    {
        // Chuyển tiêu đề thành slug
        $slug = \Str::slug($title);
        
        // Giới hạn độ dài tên file
        if (strlen($slug) > 50) {
            $slug = substr($slug, 0, 50);
        }
        
        return $slug ?: 'image';
    }

    /**
     * Tạo tên file unique
     */
    private function getUniqueFileName(string $baseName, string $extension): string
    {
        $counter = 0;
        $fileName = "editor/{$baseName}.{$extension}";
        
        while (Storage::disk('public')->exists($fileName)) {
            $counter++;
            $fileName = "editor/{$baseName}-{$counter}.{$extension}";
        }
        
        return $fileName;
    }
}
