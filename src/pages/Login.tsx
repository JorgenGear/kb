import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast,
  Container,
  Card,
  CardBody,
  Flex,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await signIn(email, password)
    } catch (error) {
      toast({
        title: 'Error signing in',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minH="100vh" w="100vw" bg="gray.50">
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        w="full"
        p={[4, 8, 12]}
      >
        <Box w={['100%', '100%', '480px']} mx="auto">
          <Card
            variant="elevated"
            shadow="xl"
            borderRadius="xl"
            bg="white"
            mx={[4, 8]}
          >
            <CardBody p={[6, 8, 10]}>
              <VStack spacing={8} align="stretch" w="full">
                <Box textAlign="center">
                  <Heading size="xl" color="gray.800">Welcome Back</Heading>
                  <Text color="gray.600" mt={2} fontSize="lg">
                    Sign in to your account
                  </Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel fontSize="md" color="gray.700">Email</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        size="lg"
                        bg="white"
                        color="gray.800"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _placeholder={{ color: 'gray.400' }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize="md" color="gray.700">Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        size="lg"
                        bg="white"
                        color="gray.800"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _placeholder={{ color: 'gray.400' }}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={loading}
                      mt={2}
                    >
                      Sign In
                    </Button>
                  </VStack>
                </Box>

                <Text textAlign="center" fontSize="md" color="gray.600">
                  Don't have an account?{' '}
                  <ChakraLink
                    as={RouterLink}
                    to="/signup"
                    color="blue.500"
                    fontWeight="semibold"
                    _hover={{ color: 'blue.600' }}
                  >
                    Sign up
                  </ChakraLink>
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  )
}

export default Login 