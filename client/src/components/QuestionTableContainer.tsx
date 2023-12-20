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
  Checkbox,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Question, Card } from "../interfaces/interfaces";
import { FiSearch } from "react-icons/fi";
import { QuestionTable } from "./QuestionTable";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  activateCards,
  fetchCards,
  archiveCards,
  resetCards,
} from "apis/data.api";
import ActionConfirmationModel from "./ActionConfirmationModel";
import { deleteCards } from "../apis/data.api";
import { useAppSelector } from "redux/hooks";
import { selectUser } from "redux/user/userSlice";

export enum TableAction {
  NORMAL,
  DELETE,
  ARCHIVE,
  ACTIVATE,
  RESET,
}

export const QuestionTableContainer: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [rowCount, setRowCount] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [orderCol, setOrderCol] = useState(4);
  const [order, setOrder] = useState(0); // 0 -> asc, 1 -> desc
  const [questions, setQuestions] = useState<Card[]>([]);
  const [onlyActive, setOnlyActive] = useState<boolean>(true);
  const [action, setAction] = useState<TableAction>(TableAction.NORMAL);
  const [selected, setSelected] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const compareFn = useRef<(a: Card, b: Card) => number>((a, b) => 0);

  const containerBg = useColorModeValue("white", "gray.900");
  const buttonColor = useColorModeValue("gray", "orange");
  const buttonVariant = useColorModeValue("solid", "outline");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const user = useAppSelector(selectUser);

  const appendSelected = (id: string) => {
    setSelected((prevSelected) => [...prevSelected, id]);
    console.log(`appending ${id}`);
  };

  const removeSelected = (id: string) => {
    setSelected((prevSelected) => prevSelected.filter((s) => s !== id));
    console.log(`removing ${id}`);
  };

  const updateCard = (id: string, newCard: Card) => {
    console.log(id);
    setQuestions(
      questions.map((card) => {
        if (card.id === id) {
          return newCard;
        }
        return card;
      })
    );
  };

  const handleSortTable = (col: number, order: number, compare: any) => {
    compareFn.current = compare;
    setOrderCol(col);
    setOrder(order);
  };

  const filteredData = useMemo(() => {
    var sortedData = questions.sort(compareFn.current);

    if (action === TableAction.NORMAL) {
      if (onlyActive) {
        sortedData = sortedData.filter((card) => !card.is_archived);
      }
    } else if (action === TableAction.ARCHIVE) {
      sortedData = sortedData.filter((card) => !card.is_archived);
    } else if (action === TableAction.ACTIVATE) {
      sortedData = sortedData.filter((card) => card.is_archived);
    }
    // else if (action === TableAction.DELETE) {
    // Use all data when TableAction.DELETE and TableAction.RESET
    // }

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
  }, [search, questions, order, orderCol, onlyActive, action]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowCount, (page + 1) * rowCount);
  }, [filteredData, page, rowCount]);

  // Get the original data
  useEffect(() => {
    fetchCards().then((cards) => {
      compareFn.current = (a, b) =>
        new Date(a.next_rep_date).getTime() -
        new Date(b.next_rep_date).getTime();
      setQuestions(cards.sort(compareFn.current));
    });

    user.lang === "EN" && user.display_sponsor_msg &&
      toast({
        position: "top",
        title: "Please Support LeetFlash!",
        description:
          "LeetFlash is a free open-source project. To ensure the normal operation of the application, I personally have to bear the server costs every month. This has become increasingly difficult for me and has forced me to consider new solutions. If your finances allow, please consider donating to help pay for server costs. Thank you for your support!",
        status: "success",
        duration: 30000,
        isClosable: true,
      });
    user.lang === "EN" && user.display_sponsor_msg &&
    toast({
      position: "top",
      title: "Please Support LeetFlash!",
      description:
        "You can close this message permanently in the setting.",
      status: "success",
      duration: 30000,
      isClosable: true,
    });

    user.lang === "CN" && user.display_sponsor_msg &&
      toast({
        position: "top",
        title: "请支持LeetFlash！",
        description:
          "LeetFlash是一项免费的开源项目。为了保证应用的正常运营，自2022上半年到现在，我个人每个月都需要承担服务器费用。这对于我来说变得越来越困难，也使得我必须考虑新的解决方案。如果经济允许，请考虑捐款以帮助支付服务器费用。谢谢你的支持！",
        status: "success",
        duration: 30000,
        isClosable: true,
      });
    user.lang === "CN" && user.display_sponsor_msg && 
      toast({
        position: "top",
        title: "请支持LeetFlash！",
        description:
          "您可以在设置中永久关闭此消息。",
        status: "success",
        duration: 30000,
        isClosable: true,
      });
    
    toast({
      position: "bottom-left",
      render: () => (
        <Box >
          <Button
            color="white" bgColor="orange" 
            onClick={() => {
              window.open(
                "https://lucheng.xyz/2022/04/14/leetflash/#%E5%85%B3%E4%BA%8ELeetFlash%F0%9F%98%8A"
              );
            }}
          >
            LeetFlash 赞助链接 / 给我留言 / Sponsorship Link / Leave me a message
          </Button>
        </Box>
      ),
      status: "success",
      duration: 30000,
      isClosable: true,
    });
  }, []);

  // Reset page whenever search keyword changes
  useEffect(() => {
    setPage(0);
  }, [filteredData]);

  const getQuestionText = () => {
    if (action === TableAction.NORMAL) {
      if (onlyActive) {
        return "Only Active";
      } else {
        return "All";
      }
    } else if (action === TableAction.ARCHIVE) {
      return "Only Active";
    } else if (action === TableAction.ACTIVATE) {
      return "Only Archived";
    } else if (action === TableAction.DELETE) {
      return "All";
    } else if (action === TableAction.RESET) {
      return "All";
    }
  };

  const confirmHandler = () => {
    if (action === TableAction.DELETE) {
      deleteCards(selected)
        .then((cards) => {
          setQuestions(cards);
        })
        .catch(() => {})
        .finally(() => {
          setAction(TableAction.NORMAL);
          setSelected([]);
        });
    } else if (action === TableAction.ACTIVATE) {
      activateCards(selected)
        .then((cards) => {
          setQuestions(cards);
        })
        .catch(() => {})
        .finally(() => {
          setAction(TableAction.NORMAL);
          setSelected([]);
        });
    } else if (action === TableAction.ARCHIVE) {
      archiveCards(selected)
        .then((cards) => {
          setQuestions(cards);
        })
        .catch(() => {})
        .finally(() => {
          setAction(TableAction.NORMAL);
          setSelected([]);
        });
    } else if (action === TableAction.RESET) {
      resetCards(selected)
        .then((cards) => {
          setQuestions(cards);
        })
        .catch(() => {})
        .finally(() => {
          setAction(TableAction.NORMAL);
          setSelected([]);
        });
    }
  };
  const toast = useToast();
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
                <Text fontSize="sm" fontWeight="light">
                  Currently Showing: {getQuestionText()} Questions
                </Text>
              </Box>
              <HStack>
                {action === TableAction.ARCHIVE && (
                  <Button
                    variant={buttonVariant}
                    colorScheme="red"
                    onClick={() => {
                      onOpen();
                      //  TODO
                    }}
                  >
                    Archive
                  </Button>
                )}
                {action === TableAction.ACTIVATE && (
                  <Button
                    variant={buttonVariant}
                    colorScheme="green"
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    Activate
                  </Button>
                )}
                {action === TableAction.DELETE && (
                  <Button
                    variant={buttonVariant}
                    colorScheme="red"
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    Delete
                  </Button>
                )}
                {action === TableAction.RESET && (
                  <Button
                    variant={buttonVariant}
                    colorScheme="red"
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    Reset
                  </Button>
                )}
                {action !== TableAction.NORMAL && (
                  <Button
                    variant={buttonVariant}
                    colorScheme={buttonColor}
                    onClick={() => {
                      setAction(TableAction.NORMAL);
                      setSelected([]);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {action === TableAction.NORMAL && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      variant="outline"
                    />
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          setOnlyActive(!onlyActive);
                        }}
                      >
                        {onlyActive
                          ? "Show Archived Questions"
                          : "Only Show Active Questions"}
                      </MenuItem>
                      <Tooltip
                        placement="right"
                        label="Archive multiple questions at once"
                      >
                        <MenuItem
                          onClick={() => {
                            setAction(TableAction.ARCHIVE);
                          }}
                        >
                          Multi Archive
                        </MenuItem>
                      </Tooltip>
                      <Tooltip
                        placement="right"
                        label="Activate multiple archived questions to active state"
                      >
                        <MenuItem
                          onClick={() => {
                            setAction(TableAction.ACTIVATE);
                          }}
                        >
                          Multi Activate
                        </MenuItem>
                      </Tooltip>
                      <Tooltip
                        placement="right"
                        label="Reset multiple questions to stage 1. If the question is archived, it will be reset to active"
                      >
                        <MenuItem
                          onClick={() => {
                            setAction(TableAction.RESET);
                          }}
                        >
                          Multi Reset
                        </MenuItem>
                      </Tooltip>
                      <Tooltip
                        placement="right"
                        label="Delete multiple questions at once"
                      >
                        <MenuItem
                          onClick={() => {
                            setAction(TableAction.DELETE);
                          }}
                        >
                          Multi Delete
                        </MenuItem>
                      </Tooltip>
                    </MenuList>
                  </Menu>
                )}
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
              </HStack>
            </Flex>
          </Box>
          {/* Main Content */}
          <Box overflowX="auto">
            <QuestionTable
              order={order}
              orderCol={orderCol}
              cards={paginatedData}
              onSort={handleSortTable}
              setCard={updateCard}
              appendSelected={appendSelected}
              removeSelected={removeSelected}
              tableAction={action}
              selected={selected}
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
      <ActionConfirmationModel
        isOpen={isOpen}
        onClose={onClose}
        tableAction={action}
        selected={selected}
        questions={questions}
        confirmHandler={confirmHandler}
      />
    </Container>
  );
};
