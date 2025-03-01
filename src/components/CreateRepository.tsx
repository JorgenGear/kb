import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Switch,
  useToast,
  Text,
  HStack,
  Icon,
  Progress,
  IconButton,
  List,
  ListItem,
} from '@chakra-ui/react'
import { FiUpload, FiX, FiFile, FiImage, FiMusic, FiVideo, FiCode } from 'react-icons/fi'
import { createRepository } from '../lib/supabase'
import { uploadFile, getFileIcon } from '../lib/file-service'
import { getCurrentUser } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface FileUpload {
  file: File
  progress: number
  uploaded?: boolean
  error?: string
}

interface CreateRepositoryProps {
  onSuccess?: () => void
}

export const CreateRepository: React.FC<CreateRepositoryProps> = ({ onSuccess }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [files, setFiles] = useState<FileUpload[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const navigate = useNavigate()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles(prev => [
      ...prev,
      ...selectedFiles.map(file => ({
        file,
        progress: 0
      }))
    ])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileTypeIcon = (mimeType: string) => {
    const iconType = getFileIcon(mimeType)
    switch (iconType) {
      case 'image': return FiImage
      case 'audio': return FiMusic
      case 'video': return FiVideo
      case 'code': return FiCode
      default: return FiFile
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: 'Repository name is required',
        status: 'error',
        duration: 3000,
      })
      return
    }

    try {
      setIsUploading(true)
      const user = await getCurrentUser()
      
      if (!user) {
        toast({
          title: 'Please sign in to create a repository',
          status: 'error',
          duration: 3000,
        })
        return
      }

      // Create repository
      const { data: repo, error } = await createRepository(name, description, user.id)
      
      if (error || !repo) {
        throw new Error(error?.message || 'Failed to create repository')
      }

      // Upload files
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const fileUpload = files[i]
          try {
            // Update progress
            setFiles(prev => prev.map((f, index) => 
              index === i ? { ...f, progress: 50 } : f
            ))

            // Upload file
            const { path, size, metadata } = await uploadFile(
              fileUpload.file,
              repo.id,
              user.id
            )

            // Create document entry for the file
            await createDocument({
              title: fileUpload.file.name,
              content: '',
              repositoryId: repo.id,
              userId: user.id,
              type: 'file',
              mimeType: fileUpload.file.type,
              filePath: path,
              fileSize: size,
              metadata
            })

            // Update progress
            setFiles(prev => prev.map((f, index) => 
              index === i ? { ...f, progress: 100, uploaded: true } : f
            ))
          } catch (err) {
            setFiles(prev => prev.map((f, index) => 
              index === i ? { ...f, error: 'Failed to upload' } : f
            ))
          }
        }
      }

      toast({
        title: 'Repository created successfully',
        status: 'success',
        duration: 3000,
      })

      onSuccess?.()
      navigate(`/repositories/${repo.id}`)
    } catch (err) {
      toast({
        title: 'Error creating repository',
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl isRequired>
          <FormLabel>Repository Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter repository name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter repository description"
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">
            Private Repository
          </FormLabel>
          <Switch
            isChecked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </FormControl>

        <Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            style={{ display: 'none' }}
            aria-label="Upload files to repository"
          />
          <Button
            leftIcon={<FiUpload />}
            onClick={() => fileInputRef.current?.click()}
            isDisabled={isUploading}
          >
            Upload Files
          </Button>
        </Box>

        {files.length > 0 && (
          <List spacing={3}>
            {files.map((fileUpload, index) => (
              <ListItem key={index}>
                <HStack>
                  <Icon as={getFileTypeIcon(fileUpload.file.type)} />
                  <Box flex="1">
                    <Text>{fileUpload.file.name}</Text>
                    <Progress
                      value={fileUpload.progress}
                      size="sm"
                      colorScheme={fileUpload.error ? 'red' : 'blue'}
                    />
                    {fileUpload.error && (
                      <Text color="red.500" fontSize="sm">
                        {fileUpload.error}
                      </Text>
                    )}
                  </Box>
                  <IconButton
                    icon={<FiX />}
                    aria-label="Remove file"
                    size="sm"
                    onClick={() => removeFile(index)}
                    isDisabled={isUploading}
                  />
                </HStack>
              </ListItem>
            ))}
          </List>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isUploading}
          loadingText="Creating Repository"
        >
          Create Repository
        </Button>
      </VStack>
    </Box>
  )
}

export default CreateRepository 