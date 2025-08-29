import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  File, 
  X,
  Search,
  Grid3X3,
  List,
  Folder,
  Home,
  Music,
  Video,
  Download,
  Plus,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Copy,
  Move
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Tree View Component
function TreeView({ 
  folders, 
  currentPath, 
  onNavigate, 
  onToggleExpansion,
  level = 0 
}: { 
  folders: FolderItem[]
  currentPath: string
  onNavigate: (path: string) => void
  onToggleExpansion: (path: string) => void
  level?: number
}) {
  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <div key={folder.path}>
          <button
            onClick={() => {
              if (folder.children && folder.children.length > 0) {
                onToggleExpansion(folder.path)
              } else {
                onNavigate(folder.path)
              }
            }}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
              currentPath === folder.path 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted",
              level > 0 && "ml-4"
            )}
          >
            <div className="flex items-center gap-1">
              {folder.children && folder.children.length > 0 && (
                <ChevronRight 
                  className={cn(
                    "h-3 w-3 transition-transform",
                    folder.isExpanded && "rotate-90"
                  )} 
                />
              )}
              {level === 0 ? (
                <Home className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Folder className="h-4 w-4 flex-shrink-0" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate">{folder.name}</div>
              <div className="text-xs opacity-70">{folder.itemCount} items</div>
            </div>
          </button>
          
          {folder.isExpanded && folder.children && folder.children.length > 0 && (
            <TreeView
              folders={folder.children}
              currentPath={currentPath}
              onNavigate={onNavigate}
              onToggleExpansion={onToggleExpansion}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
}

interface FileItem {
  name: string
  url: string
  path: string
  size: number
  type: string
  extension: string
  isImage: boolean
  uploaded_at: number
}

interface FolderItem {
  name: string
  path: string
  itemCount: number
  created_at: number
  children?: FolderItem[]
  isExpanded?: boolean
}

interface BreadcrumbItem {
  name: string
  path: string
}

interface FileManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectFile?: (file: FileItem) => void
  fileType?: 'image' | 'all'
  multiple?: boolean
  size?: 'default' | 'large'
}

export function FileManager({ 
  open, 
  onOpenChange, 
  onSelectFile, 
  fileType = 'all',
  multiple = false,
  size = 'default'
}: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [allFolders, setAllFolders] = useState<FolderItem[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [currentPath, setCurrentPath] = useState('upload')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingItem, setEditingItem] = useState<{path: string, name: string, type: 'file' | 'folder'} | null>(null)
  const [editName, setEditName] = useState('')

  // Lấy danh sách files và folders
  const fetchFiles = useCallback(async (path?: string) => {
    setLoading(true)
    try {
      const ziggyRoute = (window as any)?.route as ((name: string) => string) | undefined
      const url = ziggyRoute ? ziggyRoute('file-manager.index') : '/file-manager'
      
      const params = new URLSearchParams()
      if (path) {
        params.append('path', path)
      }
      
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
        setFolders(data.folders)
        setBreadcrumbs(data.breadcrumbs)
        setCurrentPath(data.currentPath)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Lấy tất cả folders để hiển thị tree view
  const fetchAllFolders = useCallback(async () => {
    try {
      const ziggyRoute = (window as any)?.route as ((name: string) => string) | undefined
      const url = ziggyRoute ? ziggyRoute('file-manager.index') : '/file-manager'
      
      const response = await fetch(`${url}?tree=true`, {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setAllFolders(data.folders || [])
      }
    } catch (error) {
      console.error('Error fetching all folders:', error)
    }
  }, [])

  // Upload file
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList || fileList.length === 0) return

    setUploading(true)
    try {
      const ziggyRoute = (window as any)?.route as ((name: string) => string) | undefined
      const url = ziggyRoute ? ziggyRoute('file-manager.upload') : '/file-manager/upload'

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('path', currentPath)

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        })

        if (response.ok) {
          await fetchFiles(currentPath) // Refresh danh sách
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      // Reset input
      event.target.value = ''
    }
  }

  // Delete file or folder
  const handleDelete = async (path: string, type: 'file' | 'folder') => {
    const itemType = type === 'folder' ? 'thư mục' : 'file'
    if (!confirm(`Bạn có chắc muốn xóa ${itemType} này?`)) return

    try {
      const ziggyRoute = (window as any)?.route as ((name: string) => string) | undefined
      const url = ziggyRoute ? ziggyRoute('file-manager.delete') : '/file-manager/delete'

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ path, type }),
      })

      if (response.ok) {
        await fetchFiles(currentPath) // Refresh danh sách
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const ziggyRoute = (window as any)?.route as ((name: string) => string) | undefined
      const url = ziggyRoute ? ziggyRoute('file-manager.create-folder') : '/file-manager/folder'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ 
          name: newFolderName,
          path: currentPath
        }),
      })

      if (response.ok) {
        setNewFolderName('')
        setShowCreateFolder(false)
        await fetchFiles(currentPath) // Refresh danh sách
      }
    } catch (error) {
      console.error('Create folder error:', error)
    }
  }

  // Rename file or folder
  const handleRename = async () => {
    if (!editingItem || !editName.trim()) return

    try {
      const ziggyRoute = (window as any)?.route as ((name: string) => string) | undefined
      const url = ziggyRoute ? ziggyRoute('file-manager.rename') : '/file-manager/rename'

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ 
          oldPath: editingItem.path,
          newName: editName
        }),
      })

      if (response.ok) {
        setEditingItem(null)
        setEditName('')
        await fetchFiles(currentPath) // Refresh danh sách
      }
    } catch (error) {
      console.error('Rename error:', error)
    }
  }

  // Navigate to folder
  const navigateToFolder = (path: string) => {
    fetchFiles(path)
  }

  // Toggle folder expansion
  const toggleFolderExpansion = (folderPath: string) => {
    setAllFolders(prev => {
      const updateFolder = (folders: FolderItem[]): FolderItem[] => {
        return folders.map(folder => {
          if (folder.path === folderPath) {
            return { ...folder, isExpanded: !folder.isExpanded }
          }
          if (folder.children) {
            return { ...folder, children: updateFolder(folder.children) }
          }
          return folder
        })
      }
      return updateFolder(prev)
    })
  }

  // Navigate via breadcrumb
  const navigateBreadcrumb = (path: string) => {
    fetchFiles(path)
  }

  // Chọn file
  const handleSelectFile = (file: FileItem) => {
    if (multiple) {
      const newSelected = new Set(selectedFiles)
      if (newSelected.has(file.name)) {
        newSelected.delete(file.name)
      } else {
        newSelected.add(file.name)
      }
      setSelectedFiles(newSelected)
    } else {
      onSelectFile?.(file)
      onOpenChange(false)
    }
  }

  // Xác nhận chọn nhiều file
  const handleConfirmSelection = () => {
    const selectedFileItems = files.filter(file => selectedFiles.has(file.name))
    selectedFileItems.forEach(file => onSelectFile?.(file))
    onOpenChange(false)
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Lọc files theo search và type
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = fileType === 'all' || (fileType === 'image' && file.isImage)
    return matchesSearch && matchesType
  })

  const filteredFolders = folders.filter(folder => {
    return folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  useEffect(() => {
    if (open) {
      fetchFiles()
      fetchAllFolders()
    }
  }, [open, fetchFiles, fetchAllFolders])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed z-50 bg-background overflow-hidden flex flex-col md:flex-row"
        style={{
          width: '80vw',
          height: '90vh',
          maxWidth: 'none',
          maxHeight: 'none',
          top: '5vh',
          left: '10vw',
          transform: 'none',
          borderRadius: '8px',
          padding: 0
        }}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">File Manager</DialogTitle>
        <DialogDescription className="sr-only">
          Browse and manage files and folders. Upload, create, rename, and delete files and folders.
        </DialogDescription>
                          {/* Sidebar */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r bg-muted/30 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Folders
            </h3>
          </div>
          
                     <div className="flex-1 p-2 overflow-auto">
             <nav className="space-y-1">
               {/* Tree View of All Folders */}
               {allFolders.length > 0 ? (
                 <TreeView
                   folders={allFolders}
                   currentPath={currentPath}
                   onNavigate={navigateToFolder}
                   onToggleExpansion={toggleFolderExpansion}
                 />
               ) : (
                 <div className="text-sm text-muted-foreground px-3 py-2">
                   No folders found
                 </div>
               )}
             </nav>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <DialogHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    <button
                      onClick={() => navigateBreadcrumb(crumb.path)}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {crumb.name}
                    </button>
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Toolbar */}
          <div className="border-b p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 flex flex-wrap gap-2">
                <Label htmlFor="file-upload" className="sr-only">
                  Upload Files
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleUpload}
                  accept={fileType === 'image' ? 'image/*' : undefined}
                  disabled={uploading}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={uploading}
                  size="sm"
                >
                  {uploading ? (
                    <>
                      <LoadingSpinner className="mr-2" size={14} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowCreateFolder(true)}
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
                
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              
              {multiple && selectedFiles.size > 0 && (
                <Button onClick={handleConfirmSelection} size="sm">
                  Select {selectedFiles.size} File{selectedFiles.size > 1 ? 's' : ''}
                </Button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files and folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="p-4">
                                                   <div className={cn(
                    "grid gap-2 sm:gap-4",
                    viewMode === 'grid' 
                      ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8" 
                      : "grid-cols-1"
                  )}>
                  {/* Folders */}
                  {filteredFolders.map((folder) => (
                    <div
                      key={folder.path}
                      className={cn(
                        "group relative border rounded-lg p-3 cursor-pointer transition-all hover:border-primary",
                        viewMode === 'list' && "flex items-center gap-3"
                      )}
                      onClick={() => navigateToFolder(folder.path)}
                    >
                                             <div className={cn(
                         "flex items-center justify-center bg-blue-50 rounded",
                         viewMode === 'grid' ? "h-16 sm:h-24 mb-2" : "h-12 w-12 flex-shrink-0"
                       )}>
                         <Folder className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                       </div>

                      <div className={cn("flex-1 min-w-0", viewMode === 'list' && "flex items-center gap-4")}>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate" title={folder.name}>
                            {folder.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {folder.itemCount} items
                          </p>
                          {viewMode === 'list' && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(folder.created_at * 1000).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                                             {/* Action Buttons */}
                       <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                         <Button
                           variant="ghost"
                           size="sm"
                           className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                           onClick={(e) => {
                             e.stopPropagation()
                             setEditingItem({ path: folder.path, name: folder.name, type: 'folder' })
                             setEditName(folder.name)
                           }}
                         >
                           <Edit className="h-3 w-3" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                           onClick={(e) => {
                             e.stopPropagation()
                             handleDelete(folder.path, 'folder')
                           }}
                         >
                           <Trash2 className="h-3 w-3" />
                         </Button>
                       </div>
                    </div>
                  ))}

                  {/* Files */}
                  {filteredFiles.map((file) => (
                    <div
                      key={file.path}
                      className={cn(
                        "group relative border rounded-lg p-3 cursor-pointer transition-all hover:border-primary",
                        selectedFiles.has(file.name) && "border-primary bg-primary/5",
                        viewMode === 'list' && "flex items-center gap-3"
                      )}
                      onClick={() => handleSelectFile(file)}
                    >
                                             <div className={cn(
                         "flex items-center justify-center bg-muted rounded",
                         viewMode === 'grid' ? "h-16 sm:h-24 mb-2" : "h-12 w-12 flex-shrink-0"
                       )}>
                         {file.isImage ? (
                           <img
                             src={file.url}
                             alt={file.name}
                             className="max-w-full max-h-full object-cover rounded"
                           />
                         ) : (
                           <File className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                         )}
                       </div>

                      <div className={cn("flex-1 min-w-0", viewMode === 'list' && "flex items-center gap-4")}>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                          {viewMode === 'list' && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(file.uploaded_at * 1000).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                                             {/* Action Buttons */}
                       <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                         <Button
                           variant="ghost"
                           size="sm"
                           className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                           onClick={(e) => {
                             e.stopPropagation()
                             setEditingItem({ path: file.path, name: file.name, type: 'file' })
                             setEditName(file.name)
                           }}
                         >
                           <Edit className="h-3 w-3" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                           onClick={(e) => {
                             e.stopPropagation()
                             handleDelete(file.path, 'file')
                           }}
                         >
                           <Trash2 className="h-3 w-3" />
                         </Button>
                       </div>

                       {/* Selection Indicator */}
                       {multiple && selectedFiles.has(file.name) && (
                         <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-primary text-primary-foreground rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                           <span className="text-xs">✓</span>
                         </div>
                       )}
                    </div>
                  ))}
                </div>

                {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    No files or folders found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

                 {/* Create Folder Modal */}
         {showCreateFolder && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-background p-6 rounded-lg w-full max-w-sm">
               <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
               <Input
                 placeholder="Folder name"
                 value={newFolderName}
                 onChange={(e) => setNewFolderName(e.target.value)}
                 className="mb-4"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     handleCreateFolder()
                   }
                 }}
               />
               <div className="flex gap-2 justify-end">
                 <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
                   Cancel
                 </Button>
                 <Button onClick={handleCreateFolder}>
                   Create
                 </Button>
               </div>
             </div>
           </div>
         )}

         {/* Rename Modal */}
         {editingItem && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-background p-6 rounded-lg w-full max-w-sm">
               <h3 className="text-lg font-semibold mb-4">Rename {editingItem.type}</h3>
               <Input
                 placeholder="New name"
                 value={editName}
                 onChange={(e) => setEditName(e.target.value)}
                 className="mb-4"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     handleRename()
                   }
                 }}
               />
               <div className="flex gap-2 justify-end">
                 <Button variant="outline" onClick={() => setEditingItem(null)}>
                   Cancel
                 </Button>
                 <Button onClick={handleRename}>
                   Rename
                 </Button>
               </div>
             </div>
           </div>
         )}
      </DialogContent>
    </Dialog>
  )
}
