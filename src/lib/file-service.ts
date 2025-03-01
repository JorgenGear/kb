import { supabase } from './supabase'

export interface FileMetadata {
  width?: number
  height?: number
  duration?: number
  format?: string
  encoding?: string
  thumbnail?: string
}

export const uploadFile = async (
  file: File,
  repositoryId: string,
  userId: string
): Promise<{ path: string; size: number; metadata: FileMetadata }> => {
  // Generate a unique file path
  const timestamp = Date.now()
  const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `repositories/${repositoryId}/${userId}/${timestamp}_${fileName}`

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('files')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Error uploading file: ${uploadError.message}`)
  }

  // Get file metadata
  const metadata: FileMetadata = {}

  // Extract metadata based on file type
  if (file.type.startsWith('image/')) {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = () => {
        metadata.width = img.width
        metadata.height = img.height
        metadata.format = file.type.split('/')[1]
        resolve(null)
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
    const media = file.type.startsWith('audio/') ? new Audio() : document.createElement('video')
    await new Promise((resolve, reject) => {
      media.onloadedmetadata = () => {
        metadata.duration = media.duration
        metadata.format = file.type.split('/')[1]
        resolve(null)
      }
      media.onerror = reject
      media.src = URL.createObjectURL(file)
    })
  }

  // Generate thumbnail for images and videos
  if (file.type.startsWith('image/')) {
    const { data: thumbnailData } = await supabase.storage
      .from('files')
      .getPublicUrl(`${filePath}_thumb`)

    if (thumbnailData) {
      metadata.thumbnail = thumbnailData.publicUrl
    }
  }

  return {
    path: filePath,
    size: file.size,
    metadata
  }
}

export const downloadFile = async (path: string): Promise<Blob> => {
  const { data, error } = await supabase.storage
    .from('files')
    .download(path)

  if (error) {
    throw new Error(`Error downloading file: ${error.message}`)
  }

  return data
}

export const getFileUrl = async (path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('files')
    .getPublicUrl(path)

  if (error) {
    throw new Error(`Error getting file URL: ${error.message}`)
  }

  return data.publicUrl
}

export const deleteFile = async (path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('files')
    .remove([path])

  if (error) {
    throw new Error(`Error deleting file: ${error.message}`)
  }
}

export const isPreviewSupported = (mimeType: string): boolean => {
  const supportedTypes = [
    'image/',
    'audio/',
    'video/',
    'text/',
    'application/pdf',
    'application/json',
    'application/xml',
    'application/markdown',
    'application/x-markdown'
  ]

  return supportedTypes.some(type => mimeType.startsWith(type))
}

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('text/')) return 'document'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType === 'application/json') return 'code'
  if (mimeType.includes('markdown')) return 'markdown'
  return 'file'
} 