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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
} from '@chakra-ui/react'
import { 
  FiGitBranch, 
  FiGitCommit, 
  FiGitMerge, 
  FiGitPullRequest, 
  FiMoreVertical,
  FiCopy,
  FiGitPullRequest as FiRebase
} from 'react-icons/fi'
import { 
  commitDocument, 
  getVersionHistory, 
  getBranches, 
  createBranch, 
  mergeBranches,
  cherryPick,
  rebaseBranch,
  getVersion,
  getCommitGraph
} from '../lib/version-control'
import { getCurrentUser } from '../lib/supabase'
import { DiffViewer } from './DiffViewer'
import { BranchGraph } from './BranchGraph'

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
  const [selectedVersion, setSelectedVersion] = useState<any>(null)
  const [showDiff, setShowDiff] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [commits, setCommits] = useState<any[]>([])
  
  const toast = useToast()
  const { 
    isOpen: isNewBranchOpen, 
    onOpen: onNewBranchOpen, 
    onClose: onNewBranchClose 
  } = useDisclosure()
  
  const { 
    isOpen: isDiffOpen, 
    onOpen: onDiffOpen, 
    onClose: onDiffClose 
  } = useDisclosure()

  useEffect(() => {
    loadBranches()
    loadVersionHistory()
    loadCommitGraph()
  }, [documentId])

  const loadBranches = async () => {
    const { data } = await getBranches(repositoryId)
    if (data) setBranches(data)
  }

  const loadVersionHistory = async () => {
    const { data } = await getVersionHistory(documentId)
    if (data) setVersions(data)
  }

  const loadCommitGraph = async () => {
    const data = await getCommitGraph(repositoryId)
    setCommits(data)
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
    loadCommitGraph()
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
    onNewBranchClose()
  }

  const handleCherryPick = async (version: any) => {
    const user = await getCurrentUser()
    if (!user) return

    const { error } = await cherryPick(
      version.id,
      currentBranch,
      user.id
    )

    if (error) {
      toast({
        title: 'Error cherry-picking commit',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
      return
    }

    toast({
      title: 'Commit cherry-picked successfully',
      status: 'success',
      duration: 3000,
    })

    loadVersionHistory()
    loadCommitGraph()
  }

  const handleRebase = async () => {
    if (!selectedBranch || selectedBranch === currentBranch) {
      toast({
        title: 'Select a different branch to rebase onto',
        status: 'error',
        duration: 3000,
      })
      return
    }

    const user = await getCurrentUser()
    if (!user) return

    const { error } = await rebaseBranch(
      repositoryId,
      currentBranch,
      selectedBranch,
      user.id
    )

    if (error) {
      toast({
        title: 'Error rebasing branch',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
      return
    }

    toast({
      title: 'Branch rebased successfully',
      status: 'success',
      duration: 3000,
    })

    loadVersionHistory()
    loadCommitGraph()
  }

  const handleViewDiff = async (version: any) => {
    const { data } = await getVersion(version.id)
    if (data) {
      setSelectedVersion(data)
      onDiffOpen()
    }
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
            onClick={onNewBranchOpen}
            size="sm"
          >
            New Branch
          </Button>

          <Button
            leftIcon={<FiGitMerge />}
            onClick={() => setSelectedBranch('')}
            size="sm"
            isDisabled={branches.length < 2}
          >
            Merge
          </Button>

          <Button
            leftIcon={<FiRebase />}
            onClick={handleRebase}
            size="sm"
            isDisabled={branches.length < 2}
          >
            Rebase
          </Button>

          <Button
            leftIcon={<FiGitPullRequest />}
            onClick={() => setShowGraph(!showGraph)}
            size="sm"
          >
            {showGraph ? 'Hide Graph' : 'Show Graph'}
          </Button>
        </HStack>

        {showGraph && (
          <Box border="1px" borderColor="gray.200" borderRadius="md" p={4}>
            <BranchGraph commits={commits} />
          </Box>
        )}

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
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={() => handleCherryPick(version)}
                      >
                        Cherry Pick
                      </MenuItem>
                      <MenuItem onClick={() => handleViewDiff(version)}>
                        View Changes
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>

      <Modal isOpen={isNewBranchOpen} onClose={onNewBranchClose}>
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
            <Button variant="ghost" mr={3} onClick={onNewBranchClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateBranch}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDiffOpen} onClose={onDiffClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Changes</ModalHeader>
          <ModalBody>
            {selectedVersion && (
              <DiffViewer
                oldContent={content}
                newContent={selectedVersion.content}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onDiffClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DocumentEditor 