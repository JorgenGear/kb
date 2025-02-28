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
} from '@chakra-ui/react'
import { FiFolder, FiSearch, FiPlus } from 'react-icons/fi'

const RepositoryCard = ({ name, description, documentsCount, lastUpdated }: {
  name: string;
  description: string;
  documentsCount: number;
  lastUpdated: string;
}) => (
  <Card>
    <CardHeader>
      <HStack spacing={3}>
        <Icon as={FiFolder} color="blue.500" boxSize={5} />
        <Heading size="md">{name}</Heading>
      </HStack>
    </CardHeader>
    <CardBody>
      <VStack align="stretch" spacing={3}>
        <Text color="gray.600">{description}</Text>
        <HStack>
          <Badge colorScheme="blue">{documentsCount} documents</Badge>
          <Badge colorScheme="gray">Updated {lastUpdated}</Badge>
        </HStack>
      </VStack>
    </CardBody>
    <CardFooter>
      <Button variant="ghost" colorScheme="blue">View Repository</Button>
    </CardFooter>
  </Card>
)

const Repositories = () => {
  const repositories = [
    {
      name: "Project Documentation",
      description: "Central repository for all project-related documentation, including specifications, requirements, and design documents.",
      documentsCount: 45,
      lastUpdated: "2 days ago"
    },
    {
      name: "Research Papers",
      description: "Collection of research papers, articles, and academic publications relevant to our work.",
      documentsCount: 23,
      lastUpdated: "5 days ago"
    },
    {
      name: "Meeting Notes",
      description: "Archive of meeting minutes, discussions, and decision records from team meetings.",
      documentsCount: 67,
      lastUpdated: "1 day ago"
    },
    {
      name: "Technical Guides",
      description: "Technical documentation, how-to guides, and best practices for the development team.",
      documentsCount: 34,
      lastUpdated: "1 week ago"
    }
  ]

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading mb={2}>Repositories</Heading>
            <Text color="gray.600">Manage and organize your knowledge base repositories</Text>
          </Box>
          <Button leftIcon={<FiPlus />} colorScheme="blue">
            New Repository
          </Button>
        </HStack>

        <InputGroup maxW="600px">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Search repositories..." />
        </InputGroup>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          {repositories.map((repo, index) => (
            <RepositoryCard key={index} {...repo} />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Repositories 