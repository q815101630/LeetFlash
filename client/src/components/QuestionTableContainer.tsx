/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  HStack,
  Icon,
  useColorModeValue,
  Box,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { Question, Card } from "../interfaces/interfaces";
import { FiSearch } from "react-icons/fi";
import { QuestionTable } from "./QuestionTable";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { fetchCards } from "apis/data.api";
// @ts-ignore
const { faker } = require("@faker-js/faker");

// export const members = [
//   {
//     id: '1',
//     name: 'Christian Nwamba',
//     handle: '@christian',
//     email: 'christian@chakra-ui.com',
//     avatarUrl: 'https://bit.ly/code-beast',
//     status: 'active',
//     role: 'Senior Developer Advocate',
//     rating: 4,
//   },
//   {
//     id: '2',
//     name: 'Kent C. Dodds',
//     handle: '@kent',
//     email: 'kent@chakra-ui.com',
//     avatarUrl: 'https://bit.ly/kent-c-dodds',
//     status: 'active',
//     role: 'Director of DX',
//     rating: 4,
//   },
//   {
//     id: '3',
//     name: 'Prosper Otemuyiwa',
//     handle: '@prosper',
//     email: 'prosper@chakra-ui.com',
//     avatarUrl: 'https://bit.ly/prosper-baba',
//     status: 'active',
//     role: 'Director of Evangelism',
//     rating: 4,
//   },
//   {
//     id: '4',
//     name: 'Ryan Florence',
//     handle: '@ryan',
//     email: 'ryan@chakra-ui.com',
//     avatarUrl: 'https://bit.ly/ryan-florence',
//     status: 'active',
//     role: 'Co-Founder',
//     rating: 4,
//   },
//   {
//     id: '5',
//     name: 'Segun Adebayo',
//     handle: '@segun',
//     email: 'segun@chakra-ui.com',
//     avatarUrl: 'https://bit.ly/sage-adebayo',
//     status: 'active',
//     role: 'Frontend UI Engineer',
//     rating: 4,
//   },
// ];

// use faker to generate fake data
// export const fakeData: Card[] = Array.from(Array(55).keys()).map((): Card => {
//   return {
//     created_at: faker.date.past(),
//     is_archived: faker.random.boolean(),
//     last_rep_date: faker.date.past(),
//     next_rep_date: faker.date.future(),
//     question: {
//       questionId: faker.random.number({ min: 1, max: 100 }),
//       difficulty: faker.random.arrayElement(['easy', 'medium', 'hard']),
//       url: faker.internet.url(),
//       translated_url: faker.internet.url(),
//       text: faker.lorem.sentence(),
//       translated_text: faker.lorem.sentence(),
//       title: faker.lorem.sentence().slice(0, 30),
//       translatedTitle: '阿斯顿撒大苏打',
//     },
//     stage: faker.random.number({ min: 0, max: 10 }),
//     max_stage: 10,
//     id: faker.random.uuid(),
//   };
// });

export const QuestionTableContainer: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [rowCount, setRowCount] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [orderCol, setOrderCol] = useState(4);
  const [order, setOrder] = useState(0); // 0 -> asc, 1 -> desc
  const [questions, setQuestions] = useState<Card[]>([]);
  const compareFn = useRef<(a: Card, b: Card) => number>((a, b) => 0);

  const containerBg = useColorModeValue("white", "gray.900");
  const buttonColor = useColorModeValue("gray", "orange");
  const buttonVariant = useColorModeValue("solid", "outline");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSortTable = (col: number, order: number, compare: any) => {
    compareFn.current = compare;
    setOrderCol(col);
    setOrder(order);
  };

  const filteredData = useMemo(() => {
    const sortedData = questions.sort(compareFn.current);
    if (order === 1) sortedData.reverse();

    return sortedData.filter(
      (card) =>
        `${card.question.questionId}. ${card.question.title}`.includes(
          search
        ) ||
        `${card.question.questionId}. ${card.question.translatedTitle}`.includes(
          search
        )
    );
  }, [search, questions, order, orderCol]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowCount, (page + 1) * rowCount);
  }, [filteredData, page, rowCount]);

  // Get the original data
  useEffect(() => {
    fetchCards().then((cards) => {
      setQuestions(cards);
    });
  }, []);

  // Reset page whenever search keyword changes
  useEffect(() => {
    setPage(0);
  }, [filteredData]);

  return (
    <Container maxW="container.xl">
      <Stack spacing={2} py={6}>
        <Heading size="lg" fontWeight="medium">
          Dashboard
        </Heading>
        <Text>View problems you have submitted</Text>
        <Divider bgColor={useColorModeValue("gray.300", "gray.700")} />
      </Stack>
      <Box
        py={10}
        bg={containerBg}
        boxShadow={useColorModeValue("md", "md-dark")}
        borderRadius={useBreakpointValue({ base: "none", md: "lg" })}
      >
        <Stack spacing="5">
          <Box px={{ base: "4", md: "6" }} pt="5">
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              gap={{ md: "none", base: 3 }}
            >
              <Box>
                <Text fontSize="lg" fontWeight="medium">
                  Leetcode Questions
                </Text>
              </Box>
              <InputGroup maxW={{ base: "full", md: "xs" }}>
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
            <QuestionTable
              order={order}
              orderCol={orderCol}
              cards={paginatedData}
              onSort={handleSortTable}
            />
          </Box>
          {/* Footer */}
          <Box px={{ base: "4", md: "6" }} pb="5">
            <HStack spacing="3" justify="space-between">
              {!isMobile && (
                <Text color="muted" fontSize="sm">
                  {`Showing ${
                    filteredData.length === 0 ? 0 : page * rowCount + 1
                  } to ${Math.min(
                    (page + 1) * rowCount,
                    filteredData.length
                  )} of ${filteredData.length} results`}
                </Text>
              )}

              <ButtonGroup
                spacing="3"
                justifyContent="space-between"
                width={{ base: "full", md: "auto" }}
                variant="secondary"
              >
                <Menu>
                  <Tooltip
                    label="Row per page"
                    placement="top"
                    hasArrow
                    rounded="md"
                  >
                    <MenuButton
                      as={Button}
                      variant="outline"
                      rightIcon={<ChevronDownIcon />}
                    >
                      {rowCount}
                    </MenuButton>
                  </Tooltip>
                  <MenuList>
                    {[5, 10, 25, 50, 100].map((count) => (
                      <MenuItem
                        key={count}
                        onClick={() => {
                          setRowCount(count);
                        }}
                      >
                        {count}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Button
                  variant={buttonVariant}
                  colorScheme={buttonColor}
                  onClick={() => {
                    setPage(Math.max(0, page - 1));
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant={buttonVariant}
                  colorScheme={buttonColor}
                  onClick={() => {
                    setPage(
                      Math.min(
                        Math.ceil(filteredData.length / rowCount) - 1,
                        page + 1
                      )
                    );
                  }}
                >
                  Next
                </Button>
              </ButtonGroup>
            </HStack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};
