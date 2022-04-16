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
  Button,
  IconButton,
  Tooltip,
  VStack,
  Badge,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  QuestionIcon,
  TimeIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
// @ts-ignore
import { MarkdownPreview } from 'components/MarkdownPreview';
import { Fragment, useEffect, useState } from 'react';
import { BsCalendarCheckFill } from 'react-icons/bs';
import { MdFactCheck } from 'react-icons/md';
import { fetchCards } from 'apis/data.api';
import { Card } from 'interfaces/interfaces';
import { getTodayLastSecond } from 'utils';
import { useAppSelector } from 'redux/hooks';
import { selectSettings } from 'redux/settings/settingsSlice';
import { htmlToMarkdown } from 'utils/htmlToarkdown';

const DailyReview = () => {
  const contentHeight = "70vh";
  const [showNote, setShowNote] = useState(false);
  const [questions, setQuestions] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const coontainerBg = useColorModeValue("white", "gray.900");
  const breakpoint = useBreakpointValue({ base: "horizontal", xl: "vertical" });
  const { lang } = useAppSelector(selectSettings); // EN or CN

  // Get the original data
  useEffect(() => {
    fetchCards().then((cards) => {
      setQuestions(
        cards.filter(
          (card) =>
            new Date(card.next_rep_date) <= getTodayLastSecond() &&
            !card.is_archived
        )
      );
    });
  }, []);

  const updateProblem = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), questions.length - 1));
    setShowNote(false);
  };

  return (
    <Flex w="full">
      <Container maxW={questions.length > 0 ? "container.2xl" : "container.lg"}>
        <Stack spacing={2} py={6}>
          <Heading size="lg" fontWeight="medium">
            Daily Review
          </Heading>
          <Text>View problems need to be reviewed</Text>
          <Divider bgColor={useColorModeValue("gray.300", "gray.700")} />
        </Stack>
        <Box
          rounded="md"
          boxShadow={useColorModeValue("lg", "lg-dark")}
          bg={coontainerBg}
          mb={10}
        >
          {questions.length > 0 && (
            <Fragment>
              <SimpleGrid rounded="md" columns={{ base: 1, xl: 2 }}>
                <Flex h={contentHeight}>
                  <Flex p={4} direction="column" minW="full" gap={4}>
                    <HStack>
                      <QuestionIcon w="6" h="6" />
                      <Heading as="h2" fontWeight="semibold" size="md">
                        Problem {currentIndex + 1}
                        <Tooltip label="Due date" placement="top" hasArrow>
                          <Badge mx={2}>
                            {new Date(
                              questions[currentIndex].next_rep_date
                            ).toLocaleDateString()}
                          </Badge>
                        </Tooltip>
                      </Heading>
                      <Flex flexGrow={1} justify="flex-end" gap={2}>
                        <Tooltip
                          label="Previous problem"
                          placement="top"
                          hasArrow
                        >
                          <IconButton
                            variant="outline"
                            colorScheme="blue"
                            size="md"
                            aria-label="previous"
                            onClick={() => updateProblem(currentIndex - 1)}
                            icon={<ChevronLeftIcon w="6" h="6" />}
                          ></IconButton>
                        </Tooltip>
                        <Tooltip label="Next problem" placement="top" hasArrow>
                          <IconButton
                            variant="outline"
                            colorScheme="blue"
                            size="md"
                            aria-label="previous"
                            onClick={() => updateProblem(currentIndex + 1)}
                            icon={<ChevronRightIcon w="6" h="6" />}
                          ></IconButton>
                        </Tooltip>
                      </Flex>
                    </HStack>
                    <Flex
                      minW="full"
                      flexGrow={1}
                      className="overflow-y-auto relative"
                      px={3}
                      py={2}
                      border="gray.200"
                      borderRadius="md"
                      borderWidth={1}
                    >
                      <MarkdownPreview
                        markdown={htmlToMarkdown(
                          lang === "EN"
                            ? questions[currentIndex].question.content || ""
                            : questions[currentIndex].question
                                .translatedContent || ""
                        )}
                        show={true}
                      />
                    </Flex>
                  </Flex>
                  <Divider
                    orientation={
                      breakpoint as "horizontal" | "vertical" | undefined
                    }
                  ></Divider>
                </Flex>
                <Flex p={4} direction="column" gap={4} h={contentHeight}>
                  <HStack>
                    <EditIcon w="6" h="6" />
                    <Heading as="h2" fontWeight="semibold" size="md">
                      Note
                    </Heading>
                    <Flex flexGrow={1} justify="flex-end" gap={2}>
                      <Tooltip
                        label={showNote ? "Hide note" : "Show note"}
                        placement="top"
                        hasArrow
                      >
                        <IconButton
                          variant="outline"
                          colorScheme="blue"
                          size="md"
                          aria-label="previous"
                          onClick={() => setShowNote(!showNote)}
                          icon={
                            showNote ? (
                              <ViewOffIcon w="4" h="4" />
                            ) : (
                              <ViewIcon w="4" h="4" />
                            )
                          }
                        ></IconButton>
                      </Tooltip>
                    </Flex>
                  </HStack>
                  <Box
                    className="overflow-y-auto relative"
                    border="gray.200"
                    borderRadius="md"
                    borderWidth={1}
                  >
                    <MarkdownPreview
                      markdown={questions[currentIndex].note || ""}
                      show={showNote}
                    />
                  </Box>
                </Flex>
              </SimpleGrid>
              <Flex justify="flex-end" gap={4} p={4} pt={0}>
                <Tooltip label="Review again in tomorrow" hasArrow>
                  <Button
                    variant="outline"
                    colorScheme="orange"
                    fontWeight="bold"
                    gap={2}
                  >
                    <TimeIcon />
                    Tomorrow
                  </Button>
                </Tooltip>
                <Tooltip
                  label={`Review in next stage: ${addTodayByDays(
                    questions[currentIndex].total_stages[
                      Math.min(
                        questions[currentIndex].stage + 1,
                        questions[currentIndex].total_stages.length
                      )
                    ]
                  ).toLocaleDateString()}`}
                  hasArrow
                >
                  <Button
                    variant="outline"
                    colorScheme="orange"
                    fontWeight="bold"
                    gap={2}
                  >
                    <BsCalendarCheckFill />
                    Next Stage
                  </Button>
                </Tooltip>
              </Flex>
            </Fragment>
          )}
          {questions.length === 0 && (
            <Flex justify="center" align="center" h={"40vh"}>
              <VStack>
                <MdFactCheck className="w-12 h-12 text-green-500" />
                <Text fontSize="xl" fontWeight="semibold">
                  🎉 There's no more problems needed to be reviewed. Good job 👏
                </Text>
              </VStack>
            </Flex>
          )}
        </Box>
      </Container>
    </Flex>
  );
};

export default DailyReview;
