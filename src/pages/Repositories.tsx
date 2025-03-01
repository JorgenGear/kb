import {
  Box,
  Button,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Icon,
  HStack,
  VStack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Center,
  Container,
} from '@chakra-ui/react'
import { FiFolder, FiSearch, FiPlus, FiLock, FiUnlock } from 'react-icons/fi'
import { CreateRepository } from '../components/CreateRepository'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getRepositories } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface Repository {
  id: string
  name: string
  description: string
  is_private: boolean
  created_at: string
  total_size: number
}

const RepositoryCard = ({ id, name, description, is_private, created_at, total_size }: Repository) => {
  const navigate = useNavigate()
  const timeAgo = new Date(created_at).toLocaleDateString()
  
  return (
    <Card>
      <CardHeader>
        <HStack spacing={3}>
          <Icon as={FiFolder} color="blue.500" boxSize={5} />
          <Heading size="md">{name}</Heading>
          <Icon 
            as={is_private ? FiLock : FiUnlock} 
            color={is_private ? "red.500" : "green.500"}
          />
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Text color="gray.600">{description}</Text>
          <HStack>
            <Badge colorScheme={is_private ? "red" : "green"}>
              {is_private ? "Private" : "Public"}
            </Badge>
            <Badge colorScheme="blue">
              {(total_size / 1024 / 1024).toFixed(2)} MB
            </Badge>
            <Badge colorScheme="gray">Created {timeAgo}</Badge>
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter>
        <Button 
          variant="ghost" 
          colorScheme="blue"
          onClick={() => navigate(`/repositories/${id}`)}
        >
          View Repository
        </Button>
      </CardFooter>
    </Card>
  )
}

const Repositories = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuth()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    loadRepositories()
  }, [user])

  const loadRepositories = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await getRepositories(user.id)
      
      if (error) throw error
      if (data) setRepositories(data)
    } catch (error) {
      console.error('Error loading repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container maxW="container.xl" h="full" py={6}>
      <VStack spacing={8} align="stretch" minH="full">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg" mb={2}>Repositories</Heading>
            <Text color="gray.600">Manage and organize your knowledge base repositories</Text>
          </Box>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
            New Repository
          </Button>
        </HStack>

        <InputGroup maxW="600px">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search repositories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        {loading ? (
          <Center py={8}>
            <Spinner size="xl" />
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} flex="1">
            {filteredRepositories.map((repo) => (
              <RepositoryCard key={repo.id} {...repo} />
            ))}
          </SimpleGrid>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Repository</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CreateRepository onSuccess={() => {
              onClose()
              loadRepositories()
            }} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  )
}

export default Repositories 