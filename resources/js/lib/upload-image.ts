export async function uploadImage(file: File, title?: string): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  if (title) {
    formData.append('title', title);
  }

  // Lấy URL từ Ziggy (@routes). Fallback sang '/upload-image' nếu route() không tồn tại
  const ziggyRoute = (window as any)?.route as ((name: string) => string) | undefined;
  const url = ziggyRoute ? ziggyRoute('upload.image') : '/upload-image';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    if (data.success) {
      return data.url;
    } else {
      throw new Error(data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}
