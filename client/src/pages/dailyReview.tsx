import {
  Box,
  Container,
  Text,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Divider,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { EditIcon, QuestionIcon } from '@chakra-ui/icons';
import { MarkdownEditor } from 'components/NoteEditor';

const problemDescription = `
Given a string s, return the longest palindromic substring in s. \n
Example 1:
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
Example 2:
Input: s = "cbbd"
Output: "bb"
Constraints:
1 <= s.length <= 1000
s consist of only digits and English letters.`;

const DailyReview = () => {
  const bg = useColorModeValue('gray.100', 'gray.800');
  const coontainerBg = useColorModeValue('white', 'gray.700');

  return (
    <Flex w="full" bg={bg} minH="calc(100vh - 4rem)">
      <Container maxW="container.xl">
        <Stack spacing={2} py={6}>
          <Heading size="lg" fontWeight="medium">
            Daily Review
          </Heading>
          <Text>View problems need to be reviewed</Text>
          <Divider bgColor={useColorModeValue('gray.300', 'gray.700')} />
        </Stack>
        <SimpleGrid
          rounded="md"
          columns={2}
          boxShadow={useColorModeValue('md', 'md-dark')}
          bg={coontainerBg}
          minH="40rem"
        >
          <Flex minH="full">
            <Flex p={4} direction="column" minW="full" gap={4}>
              <HStack>
                <QuestionIcon />
                <Heading as="h2" fontWeight="semibold" size="md">
                  Problem
                </Heading>
              </HStack>
              <Flex minW="full">
                <Text>{problemDescription}</Text>
              </Flex>
            </Flex>
            <Box minH="full" w="1.5rem" bg="gray.200" borderX={'1px'} borderColor="gray.300"></Box>
          </Flex>
          <Flex minH="full" p={4} direction="column" gap={4}>
            <HStack>
              <EditIcon />
              <Heading as="h2" fontWeight="semibold" size="md">
                Note
              </Heading>
            </HStack>
            <Box display="content">
              <MarkdownEditor />
            </Box>
          </Flex>
        </SimpleGrid>
      </Container>
    </Flex>
  );
};

export default DailyReview;
