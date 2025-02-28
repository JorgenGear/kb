import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  Divider,
  Card,
  CardBody,
  SimpleGrid,
} from '@chakra-ui/react'

const Settings = () => {
  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>Settings</Heading>
          <Text color="gray.600">Manage your knowledge base preferences and configurations</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Profile Settings</Heading>
                <FormControl>
                  <FormLabel>Display Name</FormLabel>
                  <Input defaultValue="John Doe" />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input defaultValue="john.doe@example.com" type="email" />
                </FormControl>
                <Button colorScheme="blue" alignSelf="flex-start">
                  Update Profile
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Notification Settings</Heading>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Email Notifications
                  </FormLabel>
                  <Switch defaultChecked />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Document Updates
                  </FormLabel>
                  <Switch defaultChecked />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Repository Changes
                  </FormLabel>
                  <Switch defaultChecked />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Display Settings</Heading>
                <FormControl>
                  <FormLabel>Theme</FormLabel>
                  <Select defaultValue="light" aria-label="Theme selection">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Language</FormLabel>
                  <Select defaultValue="en" aria-label="Language selection">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </Select>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Security Settings</Heading>
                <FormControl>
                  <FormLabel>Two-Factor Authentication</FormLabel>
                  <Switch defaultChecked />
                </FormControl>
                <Divider />
                <Button colorScheme="blue" variant="outline">
                  Change Password
                </Button>
                <Button colorScheme="red" variant="outline">
                  Delete Account
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Settings 