import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileManager } from '@/components/file-manager'
import { Image as ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageSelectorProps {
  value?: string
  onChange?: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
  size?: 'default' | 'large'
}

export function ImageSelector({ 
  value, 
  onChange, 
  label = "Featured Image",
  placeholder = "Select an image...",
  className,
  size = 'default'
}: ImageSelectorProps) {
  // Helper: resolve asset URL compatible with Laravel asset() when app runs in subfolder
  const asset = (path: string) => {
    if (typeof document !== 'undefined') {
      const meta = document.querySelector('meta[name="asset-base"]') as HTMLMetaElement | null;
      const base = meta?.content || '/';
      return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    }
    return `/${path.replace(/^\//, '')}`;
  };

  const [fileManagerOpen, setFileManagerOpen] = useState(false)

  const handleSelectFile = (file: any) => {
    onChange?.(file.url)
  }

  const handleClear = () => {
    onChange?.('')
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      
      <div className="space-y-3">
        {/* Image Preview and Input */}
        <div className="flex items-start gap-4">
          {/* Image Preview */}
          {value && (
            <div className="relative group">
                           <div className={cn(
                 "relative border rounded-lg overflow-hidden bg-muted flex-shrink-0",
                 size === 'large' ? "w-48 h-48" : "w-32 h-32"
               )}>
                <img
                  src={value}
                  alt="Featured image"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = asset('placeholder.jpg')
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {/* Clear Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Input and Button */}
          <div className="flex-1 space-y-2">
          <Input
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
                      <Button
              type="button"
              variant="outline"
              size={size === 'large' ? 'lg' : 'sm'}
              onClick={() => setFileManagerOpen(true)}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>
        </div>
      </div>

      {/* File Manager */}
      <FileManager
        open={fileManagerOpen}
        onOpenChange={setFileManagerOpen}
        onSelectFile={handleSelectFile}
        fileType="image"
        size={size}
      />
    </div>
  )
}
