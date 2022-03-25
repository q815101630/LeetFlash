import React, { useEffect, useMemo, useState } from 'react';
import {
  HStack,
  Icon,
  IconButton,
  Avatar,
  Badge,
  Box,
  Checkbox,
  Table,
  Tbody,
  Link,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useColorModeValue,
  Progress,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Question, Card } from '../interfaces/interfaces';
import { selectSettings } from 'redux/settings/settingsSlice';
import { useAppSelector } from 'redux/hooks';
// @ts-ignore
const { faker } = require('@faker-js/faker');

export const defaultPopoverContentProps = {
  sx: {
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  _focus: {
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    outline: 'none',
  },
};

interface TableHeadProps {
  name: string;
  compare?: (a: Card, b: Card) => number;
}

interface TableCellProps {
  render: (card: Card) => React.ReactNode;
}

const formatDate = (date: Date) => {
  // format date to yyyy-mm-dd
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};

// use faker to generate fake data
export const fakeData: Card[] = Array.from(Array(10).keys()).map((): Card => {
  return {
    created_at: faker.date.past(),
    is_archived: faker.random.boolean(),
    last_rep_date: faker.date.past(),
    next_rep_date: faker.date.future(),
    question: {
      question_id: faker.random.number({ min: 1, max: 100 }),
      difficulty: faker.random.arrayElement(['easy', 'medium', 'hard']),
      url: faker.internet.url(),
      translated_url: faker.internet.url(),
      text: faker.lorem.sentence(),
      translatedText: faker.lorem.sentence(),
      title: faker.lorem.sentence(),
      translatedTitle: '阿斯顿撒大苏打',
    },
    stage: faker.random.number({ min: 0, max: 10 }),
    max_stage: 10,
    id: faker.random.uuid(),
  };
});

export const QuestionTitle: React.FC<{ card: Card; lang: string }> = ({ card, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <HStack>
      <Text>{`${card.question.question_id}.`}</Text>
      <Popover placement="right" returnFocusOnClose={false} isOpen={isOpen} onClose={close}>
        <PopoverTrigger>
          <Link
            isExternal
            href={lang === 'EN' ? card.question.url : card.question.translated_url}
            _focus={{}}
            _hover={{
              textColor: 'blue.500',
              textDecoration: 'underline',
            }}
            onMouseEnter={open}
            onMouseLeave={close}
          >
            <Text fontWeight="semibold">{lang === 'EN' ? card.question.title : card.question.translatedTitle}</Text>
          </Link>
        </PopoverTrigger>
        <PopoverContent {...defaultPopoverContentProps}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader fontWeight="semibold">Question Prompt</PopoverHeader>
          <PopoverBody>{lang === 'EN' ? card.question.text : card.question.translatedText}</PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};

export const QuestionTable: React.FC<{ search: string }> = (props) => {
  const [cards, setCards] = useState(fakeData);
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
        compare: (a, b) => new Date(a.last_rep_date).getTime() - new Date(b.last_rep_date).getTime(),
      },
      {
        name: 'Next Repition',
        compare: (a, b) => new Date(a.next_rep_date).getTime() - new Date(b.next_rep_date).getTime(),
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
        // @ts-ignore
        render: (card) => <Progress hasStripe value={(card.stage / card.max_stage) * 100} />,
      },
    ],
    [lang]
  );

  useEffect(() => {
    sortTable(orderCol, order);
  }, []);

  const tableHeadBg = useColorModeValue('gray.50', 'gray.700');
  // const tableRowBg = useColorModeValue('gray.200', 'gray.300');

  const sortTable = (col: number, order: number) => {
    const newCards = cards.sort(tableHeaders[col].compare);

    if (order === 1) {
      newCards.reverse();
      setCards(newCards);
    }

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
                    console.log('ADADAD');
                    sortTable(i, orderCol === i ? (order + 1) % 2 : 0);
                  }}
                />
              </HStack>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {cards
          .filter(
            (card) =>
              `${card.question.question_id}. ${card.question.title}`.includes(props.search) ||
              `${card.question.question_id}. ${card.question.translatedTitle}`.includes(props.search)
          )
          .map((card) => (
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
