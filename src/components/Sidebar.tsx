import {
  Box,
  VStack,
  Text,
  Icon,
  Link,
  Heading,
  useColorMode,
} from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiBook,
  FiFolder,
  FiSettings,
} from 'react-icons/fi'

const NavItem = ({ icon, children, to }: { icon: any; children: string; to: string }) => {
  const location = useLocation()
  const { colorMode } = useColorMode()
  const isActive = location.pathname === to

  return (
    <Link
      as={RouterLink}
      to={to}
      w="full"
      p={3}
      borderRadius="md"
      bg={isActive 
        ? (colorMode === 'dark' ? 'blue.800' : 'blue.100')
        : 'transparent'
      }
      color={isActive
        ? (colorMode === 'dark' ? 'blue.200' : 'blue.700')
        : (colorMode === 'dark' ? 'gray.300' : 'gray.700')
      }
      _hover={{
        bg: isActive
          ? (colorMode === 'dark' ? 'blue.800' : 'blue.100')
          : (colorMode === 'dark' ? 'gray.700' : 'gray.100')
      }}
      display="flex"
      alignItems="center"
      gap={3}
    >
      <Icon as={icon} boxSize={5} />
      <Text fontWeight="medium">{children}</Text>
    </Link>
  )
}

const Sidebar = () => {
  const { colorMode } = useColorMode()

  return (
    <Box
      w="250px"
      bg={colorMode === 'dark' ? 'gray.700' : 'white'}
      borderRight="1px"
      borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
      py={5}
      px={3}
    >
      <VStack align="stretch" spacing={8}>
        <Box px={3}>
          <Heading size="md" color={colorMode === 'dark' ? 'blue.200' : 'blue.600'}>
            KnowledgeBase
          </Heading>
        </Box>

        <VStack align="stretch" spacing={1}>
          <NavItem icon={FiHome} to="/">
            Dashboard
          </NavItem>
          <NavItem icon={FiFolder} to="/repositories">
            Repositories
          </NavItem>
          <NavItem icon={FiBook} to="/documents">
            Documents
          </NavItem>
          <NavItem icon={FiSettings} to="/settings">
            Settings
          </NavItem>
        </VStack>
      </VStack>
    </Box>
  )
}

export default Sidebar 