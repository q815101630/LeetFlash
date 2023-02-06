import React, { useEffect, useMemo, useState } from "react";
import {
  HStack,
  Icon,
  IconButton,
  Badge,
  Box,
  Checkbox,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useColorModeValue,
  Progress,
  Tooltip,
  Stack,

} from "@chakra-ui/react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { Card } from "../interfaces/interfaces";
import { selectSettings } from "redux/settings/settingsSlice";
import { useAppSelector } from "redux/hooks";
import { formatDate } from "utils";
import { QuestionTitle } from "./QuestionTitle";
import { patchCard } from "apis/data.api";
import { TableAction } from "./QuestionTableContainer";

interface TableHeadProps {
  name: string;
  compare: (a: Card, b: Card) => number;
}

interface TableCellProps {
  render: (card: Card) => React.ReactNode;
}

export interface QuestionTableProps {
  cards: Card[];
  orderCol: number;
  order: number;
  onSort: (
    col: number,
    order: number,
    compare: (a: Card, b: Card) => number
  ) => void;
  setCard: (id: string, card: Card) => void;
  appendSelected: (id: string) => void;
  removeSelected: (id: string) => void;
  tableAction: TableAction;
  selected: string[];
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  cards,
  orderCol,
  order,
  onSort,
  setCard,
  appendSelected,
  removeSelected,
  tableAction,
  selected,
}) => {
  const { lang } = useAppSelector(selectSettings); // EN or CN

  // const handleSelect = (card: Card) => {
  //   const newCard = {
  //     ...card,
  //     is_archived: !card.is_archived,
  //   };

  //   patchCard(newCard)
  //     .then(() => setCard(newCard.id, newCard))
  //     .catch(console.log);

  //   return;
  // };

  const tableHeaders: TableHeadProps[] = useMemo(() => {
    return [
      {
        name: tableAction === TableAction.NORMAL ? "Archived" : "Select",
        // @ts-ignore
        compare: (a, b) => a.is_archived - b.is_archived,
      },
      {
        name: "Title",
        compare: (a, b) =>
          parseInt(a.question.questionId) - parseInt(b.question.questionId),
      },
      {
        name: "Difficulty",
        compare: (a, b) => {
          const orders = {
            Easy: 1,
            Medium: 2,
            Hard: 3,
          };
          // @ts-ignore
          return orders[a.question.difficulty] - orders[b.question.difficulty];
        },
      },
      {
        name: "Last Repetition",
        compare: (a, b) =>
          new Date(a.last_rep_date).getTime() -
          new Date(b.last_rep_date).getTime(),
      },
      {
        name: "Next Repetition",
        compare: (a, b) =>
          new Date(a.next_rep_date).getTime() -
          new Date(b.next_rep_date).getTime(),
      },
      {
        name: "Progress",
        // @ts-ignore
        compare: (a, b) =>
          a.stage / a.total_stages.length - b.stage / b.total_stages.length,
      },
    ];
  }, [tableAction]);

  const tableCells: TableCellProps[] = useMemo(
    () => [
      {
        render: (card) => (
          <Checkbox
            isDisabled={tableAction === TableAction.NORMAL}
            isChecked={
              tableAction === TableAction.NORMAL
                ? card.is_archived
                : selected.indexOf(card.id) > -1
            }
            onChange={(e) => {
              if (e.target.checked) {
                appendSelected(
                  card.id
                );
              } else {
                removeSelected(card.id);
              }
            }}
          />
        ),
      },
      {
        render: (card) => {
          return <QuestionTitle card={card} lang={lang} />;
        },
      },
      {
        render: (card) => {
          const colors = {
            Easy: "green",
            Medium: "yellow",
            Hard: "red",
          };

          return (
            <Box pl={2}>
              <Badge
                fontSize="sm"
                colorScheme={colors[card.question.difficulty]}
              >
                {card.question.difficulty}
              </Badge>
            </Box>
          );
        },
      },
      {
        render: (card) => <Text>{formatDate(card.last_rep_date)}</Text>,
      },
      {
        render: (card) => <Text>{formatDate(card.next_rep_date)}</Text>,
      },
      {
        render: (card) => (
          // @ts-ignore
          <HStack>
            <Progress
              w={100}
              hasStripe
              value={(card.stage / card.total_stages.length) * 100}
            />
            <Badge colorScheme='purple'>{card.stage} / {card.total_stages.length}</Badge>
          </HStack>
        ),
      },
    ],
    [lang, tableAction, selected]
  );

  const tableHeadBg = useColorModeValue("gray.50", "gray.700");
  // const tableRowBg = useColorModeValue('gray.200', 'gray.300');

  return (
    <Table minW={1000}>
      <Thead bg={tableHeadBg}>
        <Tr>
          {tableHeaders.map((header, i) => (
            <Th key={`t-head-${i}`}>
              <HStack spacing="3">
                <Text>{header.name}</Text>
                <IconButton
                  size="xs"
                  variant="ghost"
                  aria-label="Sort"
                  opacity={orderCol === i ? 1 : 0.5}
                  icon={
                    <Icon
                      as={
                        orderCol !== i || order === 0 ? IoArrowUp : IoArrowDown
                      }
                    />
                  }
                  onClick={() => {
                    onSort(
                      i,
                      orderCol === i ? (order + 1) % 2 : 0,
                      header.compare
                    );
                  }}
                />
              </HStack>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {cards.map((card, i) => (
          <Tr key={`t-row-${i}`}>
            {tableCells.map((cell, i) => (
              <Td key={`t-cell-${i}`}>{cell.render(card)}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
