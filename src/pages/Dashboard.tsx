import {
  Box,
  Grid,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { FiFile, FiFolder, FiUsers, FiActivity } from 'react-icons/fi'

const StatCard = ({ label, number, icon, helpText }: {
  label: string;
  number: string;
  icon: any;
  helpText: string;
}) => (
  <Card>
    <CardBody>
      <Stat>
        <HStack spacing={4}>
          <Box>
            <Icon as={icon} boxSize={6} color="blue.500" />
          </Box>
          <Box>
            <StatLabel>{label}</StatLabel>
            <StatNumber>{number}</StatNumber>
            <StatHelpText>{helpText}</StatHelpText>
          </Box>
        </HStack>
      </Stat>
    </CardBody>
  </Card>
)

const RecentActivity = () => (
  <Card>
    <CardBody>
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Recent Activity</Heading>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Text>Updated "Project Documentation"</Text>
            <Text color="gray.500">2 hours ago</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Created new repository "Research Papers"</Text>
            <Text color="gray.500">5 hours ago</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Added new document to "Meeting Notes"</Text>
            <Text color="gray.500">1 day ago</Text>
          </HStack>
        </VStack>
      </VStack>
    </CardBody>
  </Card>
)

const Dashboard = () => {
  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>Dashboard</Heading>
          <Text color="gray.600">Welcome back! Here's what's happening with your knowledge base.</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <StatCard
            label="Total Documents"
            number="156"
            icon={FiFile}
            helpText="+12 this week"
          />
          <StatCard
            label="Repositories"
            number="24"
            icon={FiFolder}
            helpText="+3 this month"
          />
          <StatCard
            label="Contributors"
            number="8"
            icon={FiUsers}
            helpText="Active this week"
          />
          <StatCard
            label="Activities"
            number="43"
            icon={FiActivity}
            helpText="Last 7 days"
          />
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={4}>
          <RecentActivity />
          {/* Add more sections here like Popular Docs, etc. */}
        </Grid>
      </VStack>
    </Box>
  )
}

export default Dashboard 