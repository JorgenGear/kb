import {
  Box,
  Button,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  VStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { FiSearch, FiPlus, FiFile, FiMoreVertical } from 'react-icons/fi'

const DocumentRow = ({ title, repository, type, lastModified, author }: {
  title: string;
  repository: string;
  type: string;
  lastModified: string;
  author: string;
}) => (
  <Tr>
    <Td>
      <HStack>
        <Icon as={FiFile} color="blue.500" />
        <Text fontWeight="medium">{title}</Text>
      </HStack>
    </Td>
    <Td>
      <Badge colorScheme="blue">{repository}</Badge>
    </Td>
    <Td>{type}</Td>
    <Td>{lastModified}</Td>
    <Td>{author}</Td>
    <Td>
      <Menu>
        <MenuButton as={Button} variant="ghost" size="sm">
          <Icon as={FiMoreVertical} />
        </MenuButton>
        <MenuList>
          <MenuItem>View</MenuItem>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Share</MenuItem>
          <MenuItem color="red.500">Delete</MenuItem>
        </MenuList>
      </Menu>
    </Td>
  </Tr>
)

const Documents = () => {
  const documents = [
    {
      title: "System Architecture Overview",
      repository: "Technical Guides",
      type: "Documentation",
      lastModified: "2 hours ago",
      author: "John Doe"
    },
    {
      title: "Q1 2024 Research Summary",
      repository: "Research Papers",
      type: "Report",
      lastModified: "1 day ago",
      author: "Jane Smith"
    },
    {
      title: "Product Requirements",
      repository: "Project Documentation",
      type: "Specification",
      lastModified: "3 days ago",
      author: "Mike Johnson"
    },
    {
      title: "Team Sync Notes",
      repository: "Meeting Notes",
      type: "Notes",
      lastModified: "5 days ago",
      author: "Sarah Wilson"
    }
  ]

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading mb={2}>Documents</Heading>
            <Text color="gray.600">Browse and manage your knowledge base documents</Text>
          </Box>
          <Button leftIcon={<FiPlus />} colorScheme="blue">
            New Document
          </Button>
        </HStack>

        <HStack spacing={4}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Search documents..." />
          </InputGroup>
          <Select placeholder="Repository" maxW="200px" aria-label="Filter by repository">
            <option value="technical-guides">Technical Guides</option>
            <option value="research-papers">Research Papers</option>
            <option value="project-docs">Project Documentation</option>
            <option value="meeting-notes">Meeting Notes</option>
          </Select>
          <Select placeholder="Type" maxW="200px" aria-label="Filter by document type">
            <option value="documentation">Documentation</option>
            <option value="report">Report</option>
            <option value="specification">Specification</option>
            <option value="notes">Notes</option>
          </Select>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Repository</Th>
                <Th>Type</Th>
                <Th>Last Modified</Th>
                <Th>Author</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {documents.map((doc, index) => (
                <DocumentRow key={index} {...doc} />
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  )
}

export default Documents 