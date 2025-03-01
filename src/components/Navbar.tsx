import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useColorMode,
  Tooltip,
  Text,
  MenuDivider,
  Container,
} from '@chakra-ui/react'
import { SearchIcon, BellIcon, SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Box 
      bg={colorMode === 'dark' ? 'gray.700' : 'white'} 
      borderBottom="1px" 
      borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
      w="full"
      px={4}
      py={2}
    >
      <Flex alignItems="center" justifyContent="space-between" w="full" maxW="100%">
        <InputGroup maxW="600px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color={colorMode === 'dark' ? 'gray.400' : 'gray.400'} />
          </InputLeftElement>
          <Input
            placeholder="Search knowledge bases..."
            bg={colorMode === 'dark' ? 'gray.600' : 'gray.100'}
            border="none"
            _focus={{ 
              bg: colorMode === 'dark' ? 'gray.500' : 'white',
              boxShadow: 'md' 
            }}
          />
        </InputGroup>

        <Flex alignItems="center" gap={4}>
          <Tooltip label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              fontSize="20px"
            />
          </Tooltip>

          <IconButton
            aria-label="Notifications"
            icon={<BellIcon />}
            variant="ghost"
            fontSize="20px"
          />
          
          <Menu>
            <MenuButton>
              <Avatar 
                size="sm" 
                name={user?.user_metadata?.full_name || user?.email} 
                src={user?.user_metadata?.avatar_url}
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/profile')}>
                <Box>
                  <Text fontWeight="medium">
                    {user?.user_metadata?.full_name || 'User'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {user?.email}
                  </Text>
                </Box>
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => navigate('/repositories')}>
                My Repositories
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleSignOut} color="red.500">
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar 