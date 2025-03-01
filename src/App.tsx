import { ChakraProvider, Box, useColorMode } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { ColorModeScript } from '@chakra-ui/react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Repositories from './pages/Repositories'
import Documents from './pages/Documents'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import theme from './theme'

const DashboardLayout = () => {
  const { colorMode } = useColorMode()
  
  return (
    <Box display="flex" h="100vh" maxH="100vh" overflow="hidden" w="100vw">
      <Sidebar />
      <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
        <Navbar />
        <Box 
          flex="1" 
          overflow="auto"
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          px={4}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/repositories" element={<Repositories />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App
