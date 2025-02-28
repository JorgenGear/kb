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
} from '@chakra-ui/react'
import { SearchIcon, BellIcon, SunIcon, MoonIcon } from '@chakra-ui/icons'

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box bg={colorMode === 'dark' ? 'gray.700' : 'white'} px={4} py={2} borderBottom="1px" borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}>
      <Flex alignItems="center" justifyContent="space-between">
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
              <Avatar size="sm" name="User" src="https://bit.ly/broken-link" />
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>My Repositories</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar 