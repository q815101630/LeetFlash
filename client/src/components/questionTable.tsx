import React, { useEffect, useMemo, useState } from 'react';
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
} from '@chakra-ui/react';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';
import { Card } from '../interfaces/interfaces';
import { selectSettings } from 'redux/settings/settingsSlice';
import { useAppSelector } from 'redux/hooks';
import { formatDate } from 'utils';
import { QuestionTitle } from './QuestionTitle';

interface TableHeadProps {
  name: string;
  compare?: (a: Card, b: Card) => number;
}

interface TableCellProps {
  render: (card: Card) => React.ReactNode;
}

export interface QuestionTableProps {
  search: string;
  cards: Card[];
  rowCount: number;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({ search, cards, rowCount }) => {
  const [orderCol, setOrderCol] = useState(4);
  const [order, setOrder] = useState(0); // 0 -> asc, 1 -> desc

  const { lang } = useAppSelector(selectSettings); // EN or CN

  const tableHeaders: TableHeadProps[] = useMemo(() => {
    return [
      {
        name: 'Archived',
        // @ts-ignore
        compare: (a, b) => a.is_archived - b.is_archived,
      },
      {
        name: 'Title',
        compare: (a, b) => parseInt(a.question.question_id) - parseInt(b.question.question_id),
      },
      {
        name: 'Difficulty',
        compare: (a, b) => {
          const orders = {
            easy: 1,
            medium: 2,
            hard: 3,
          };
          // @ts-ignore
          return orders[a.question.difficulty] - orders[b.question.difficulty];
        },
      },
      {
        name: 'Last Repition',
        compare: (a, b) =>
          new Date(a.last_rep_date).getTime() - new Date(b.last_rep_date).getTime(),
      },
      {
        name: 'Next Repition',
        compare: (a, b) =>
          new Date(a.next_rep_date).getTime() - new Date(b.next_rep_date).getTime(),
      },
      {
        name: 'Progress',
        // @ts-ignore
        compare: (a, b) => a.stage / a.max_stage - b.stage / b.max_stage,
      },
    ];
  }, []);

  const tableCells: TableCellProps[] = useMemo(
    () => [
      {
        render: (card) => <Checkbox isChecked={card.is_archived} />,
      },
      {
        render: (card) => {
          return <QuestionTitle card={card} lang={lang} />;
        },
      },
      {
        render: (card) => {
          const colors = {
            easy: 'green',
            medium: 'yellow',
            hard: 'red',
          };

          return (
            <Box pl={2}>
              <Badge fontSize="sm" colorScheme={colors[card.question.difficulty]}>
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
          <Progress w={100} hasStripe value={(card.stage / card.max_stage) * 100} />
        ),
      },
    ],
    [lang]
  );

  useEffect(() => {
    sortTable(orderCol, order);
  }, []);

  const tableHeadBg = useColorModeValue('gray.50', 'gray.700');
  // const tableRowBg = useColorModeValue('gray.200', 'gray.300');

  const sortedCards = useMemo(() => {
    const newCards = cards.sort(tableHeaders[orderCol].compare);
    if (order === 1) newCards.reverse();

    return newCards;
  }, [cards, tableHeaders, orderCol, order]);

  const sortTable = (col: number, order: number) => {
    setOrderCol(col);
    setOrder(order);
  };

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
                  icon={<Icon as={orderCol !== i || order === 0 ? IoArrowUp : IoArrowDown} />}
                  onClick={() => {
                    sortTable(i, orderCol === i ? (order + 1) % 2 : 0);
                  }}
                />
              </HStack>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {sortedCards.map((card) => (
          <Tr key={card.id}>
            {tableCells.map((cell, i) => (
              <Td key={`t-cell-${i}`}>{cell.render(card)}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
