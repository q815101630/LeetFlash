import {
  HStack,
  Icon,
  StackProps,
  useColorModeValue,
  Avatar,
  Badge,
  Box,
  Checkbox,
  IconButton,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  ButtonGroup,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import * as React from 'react';

import { FiSearch } from 'react-icons/fi';
import { QuestionTable } from './questionTable';

export const members = [
  {
    id: '1',
    name: 'Christian Nwamba',
    handle: '@christian',
    email: 'christian@chakra-ui.com',
    avatarUrl: 'https://bit.ly/code-beast',
    status: 'active',
    role: 'Senior Developer Advocate',
    rating: 4,
  },
  {
    id: '2',
    name: 'Kent C. Dodds',
    handle: '@kent',
    email: 'kent@chakra-ui.com',
    avatarUrl: 'https://bit.ly/kent-c-dodds',
    status: 'active',
    role: 'Director of DX',
    rating: 4,
  },
  {
    id: '3',
    name: 'Prosper Otemuyiwa',
    handle: '@prosper',
    email: 'prosper@chakra-ui.com',
    avatarUrl: 'https://bit.ly/prosper-baba',
    status: 'active',
    role: 'Director of Evangelism',
    rating: 4,
  },
  {
    id: '4',
    name: 'Ryan Florence',
    handle: '@ryan',
    email: 'ryan@chakra-ui.com',
    avatarUrl: 'https://bit.ly/ryan-florence',
    status: 'active',
    role: 'Co-Founder',
    rating: 4,
  },
  {
    id: '5',
    name: 'Segun Adebayo',
    handle: '@segun',
    email: 'segun@chakra-ui.com',
    avatarUrl: 'https://bit.ly/sage-adebayo',
    status: 'active',
    role: 'Frontend UI Engineer',
    rating: 4,
  },
];

export const QuestionTableContainer: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [search, setSearch] = React.useState('');

  const containerBg = useColorModeValue('white', 'gray.900');

  return (
    <Container maxW="container.xl">
      <Box my={10} bg={containerBg} boxShadow={useColorModeValue('md', 'md-dark')} borderRadius={useBreakpointValue({ base: 'none', md: 'lg' })}>
        <Stack spacing="5">
          <Box px={{ base: '4', md: '6' }} pt="5">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              gap={{
                md: 'none',
                base: 3,
              }}
            >
              <Box>
                <Text fontSize="lg" fontWeight="medium">
                  Leetcode Questions
                </Text>
              </Box>
              <InputGroup
                maxW={{
                  base: 'full',
                  md: 'xs',
                }}
              >
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="muted" boxSize="5" />
                </InputLeftElement>
                <Input
                  placeholder="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </InputGroup>
            </Flex>
          </Box>
          {/* Main Content */}
          <Box overflowX="auto">
            <QuestionTable search={search} />
          </Box>
          {/* Footer */}
          <Box px={{ base: '4', md: '6' }} pb="5">
            <HStack spacing="3" justify="space-between">
              {!isMobile && (
                <Text color="muted" fontSize="sm">
                  Showing 1 to 5 of 42 results
                </Text>
              )}
              <ButtonGroup spacing="3" justifyContent="space-between" width={{ base: 'full', md: 'auto' }} variant="secondary">
                <Button>Previous</Button>
                <Button>Next</Button>
              </ButtonGroup>
            </HStack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};
