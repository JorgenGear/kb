import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Textarea,
  Input,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  List,
  ListItem,
  Avatar,
  Badge,
} from '@chakra-ui/react'
import { FiGitBranch, FiGitCommit, FiGitMerge } from 'react-icons/fi'
import { commitDocument, getVersionHistory, getBranches, createBranch, mergeBranches } from '../lib/version-control'
import { getCurrentUser } from '../lib/supabase'

interface DocumentEditorProps {
  documentId: string
  repositoryId: string
  initialContent: string
  initialTitle: string
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  documentId,
  repositoryId,
  initialContent,
  initialTitle,
}) => {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState(initialTitle)
  const [commitMessage, setCommitMessage] = useState('')
  const [currentBranch, setCurrentBranch] = useState('main')
  const [branches, setBranches] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState('')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    loadBranches()
    loadVersionHistory()
  }, [documentId])

  const loadBranches = async () => {
    const { data } = await getBranches(repositoryId)
    if (data) setBranches(data)
  }

  const loadVersionHistory = async () => {
    const { data } = await getVersionHistory(documentId)
    if (data) setVersions(data)
  }

  const handleCommit = async () => {
    if (!commitMessage) {
      toast({
        title: 'Commit message required',
        status: 'error',
        duration: 3000,
      })
      return
    }

    const user = await getCurrentUser()
    if (!user) return

    const { error } = await commitDocument(
      documentId,
      content,
      commitMessage,
      user.id,
      currentBranch
    )

    if (error) {
      toast({
        title: 'Error saving changes',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
      return
    }

    toast({
      title: 'Changes committed successfully',
      status: 'success',
      duration: 3000,
    })

    setCommitMessage('')
    loadVersionHistory()
  }

  const handleCreateBranch = async () => {
    if (!selectedBranch) {
      toast({
        title: 'Branch name required',
        status: 'error',
        duration: 3000,
      })
      return
    }

    const { error } = await createBranch(repositoryId, selectedBranch)
    if (error) {
      toast({
        title: 'Error creating branch',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
      return
    }

    toast({
      title: 'Branch created successfully',
      status: 'success',
      duration: 3000,
    })

    loadBranches()
    setSelectedBranch('')
    onClose()
  }

  const handleMergeBranch = async () => {
    if (!selectedBranch || selectedBranch === currentBranch) {
      toast({
        title: 'Select a different branch to merge',
        status: 'error',
        duration: 3000,
      })
      return
    }

    const user = await getCurrentUser()
    if (!user) return

    const { error } = await mergeBranches(
      repositoryId,
      selectedBranch,
      currentBranch,
      user.id
    )

    if (error) {
      toast({
        title: 'Error merging branches',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
      return
    }

    toast({
      title: 'Branches merged successfully',
      status: 'success',
      duration: 3000,
    })

    loadVersionHistory()
    setSelectedBranch('')
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fontSize="2xl"
          fontWeight="bold"
          variant="unstyled"
          placeholder="Document Title"
        />

        <HStack>
          <Select
            value={currentBranch}
            onChange={(e) => setCurrentBranch(e.target.value)}
            maxW="200px"
            aria-label="Select branch"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </Select>

          <Button
            leftIcon={<FiGitBranch />}
            onClick={onOpen}
            size="sm"
          >
            New Branch
          </Button>

          <Button
            leftIcon={<FiGitMerge />}
            onClick={handleMergeBranch}
            size="sm"
            isDisabled={branches.length < 2}
          >
            Merge
          </Button>
        </HStack>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          minH="400px"
          placeholder="Start writing your document..."
        />

        <HStack>
          <Input
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message"
            flex={1}
          />
          <Button
            leftIcon={<FiGitCommit />}
            onClick={handleCommit}
            colorScheme="blue"
          >
            Commit
          </Button>
        </HStack>

        <Box>
          <Text fontWeight="bold" mb={2}>Version History</Text>
          <List spacing={3}>
            {versions.map((version) => (
              <ListItem
                key={version.id}
                p={2}
                bg="gray.50"
                borderRadius="md"
              >
                <HStack>
                  <Avatar
                    size="sm"
                    name={version.profiles?.username}
                    src={version.profiles?.avatar_url}
                  />
                  <Box flex={1}>
                    <Text fontWeight="medium">
                      {version.commit_message}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(version.created_at).toLocaleString()}
                    </Text>
                  </Box>
                  <Badge colorScheme="blue">
                    {version.branch}
                  </Badge>
                </HStack>
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Branch</ModalHeader>
          <ModalBody>
            <Input
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              placeholder="Branch name"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateBranch}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DocumentEditor 