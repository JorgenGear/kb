import React from 'react'
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react'
import { diffLines } from 'diff'

interface DiffViewerProps {
  oldContent: string
  newContent: string
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  oldContent,
  newContent,
}) => {
  const diff = diffLines(oldContent, newContent)

  return (
    <Box
      fontFamily="mono"
      fontSize="sm"
      bg="gray.50"
      p={4}
      borderRadius="md"
      overflowX="auto"
    >
      <VStack align="stretch" spacing={0}>
        {diff.map((part, index) => (
          <HStack
            key={index}
            bg={part.added ? 'green.50' : part.removed ? 'red.50' : 'transparent'}
            p={1}
            spacing={4}
          >
            <Text color={part.added ? 'green.600' : part.removed ? 'red.600' : 'gray.600'} w="20px">
              {part.added ? '+' : part.removed ? '-' : ' '}
            </Text>
            <Text whiteSpace="pre-wrap">
              {part.value}
            </Text>
            {(part.added || part.removed) && (
              <Badge
                colorScheme={part.added ? 'green' : 'red'}
                ml="auto"
              >
                {part.count} {part.count === 1 ? 'line' : 'lines'} {part.added ? 'added' : 'removed'}
              </Badge>
            )}
          </HStack>
        ))}
      </VStack>
    </Box>
  )
}

export default DiffViewer 