import { Box, Text, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { TitleColumnFilterComponent, TitleColumnFilter } from 'components/Filters';
import * as React from 'react';
import { CellProps, Column, Row } from 'react-table';
import { useAppSelector } from 'redux/hooks';
import { DifficultyType, selectSettings } from 'redux/settings/settingsSlice';
import { fetchCards, fetchQuestions } from '../apis/data.api';
import { DataTable } from '../components/dataTable';
import DifficultyHeader from '../components/DifficultyHeader';
import QuestionCell from '../components/QuestionCell';
import UrlCell from '../components/UrlCell';
import { Card, FlattenedCard, Question } from '../interfaces/interfaces';
import SideBar from '../components/SideBar';
import { DisplayType } from './setting';
import { QuestionTableContainer } from 'components/questioTableContainer';

// see https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table
// to configure react-table typings

export const Dashboard = () => {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [cards, setCards] = React.useState<Card[]>([]);
  const [difficultyType, setDifficultyType] = React.useState<DifficultyType>(DifficultyType.ALL);
  const questionsData = React.useMemo(() => [...questions], [questions]);

  const bg = useColorModeValue('gray.100', 'gray.800');

  // flatten the question field in the card object
  // const flattenedCards: FlattenedCard[] = cards.map((card: Card) => {
  //   const flattenedCard = {
  //     ...card,
  //     ...card.question,
  //   };
  //   // @ts-ignore: question must exist
  //   delete flattenedCard.question;
  //   return flattenedCard;
  // });

  // const cardsData = React.useMemo(() => [...flattenedCards], [flattenedCards]);
  const cardsData: FlattenedCard[] = React.useMemo(
    () =>
      [
        {
          question_id: '123',
          difficulty: 'hard',
          url: 'https://www.google.com',
          text: 'text',
          translatedText: 'translated_text',
          title: 'title',
          translatedTitle: 'translated_title',
          created_at: 'string',
          is_archived: true,
          last_rep_date: 'string',
          next_rep_date: 'string',
          stage: 1,
          id: 'string',
        },
      ] as FlattenedCard[],
    []
  );

  const settings = useAppSelector(selectSettings);
  const [displayType, setDisplayType] = React.useState<DisplayType>(DisplayType.API);

  React.useEffect(() => {
    const fetchData = async () => {
      const questions = await fetchQuestions();
      setQuestions(questions);
      const cards = await fetchCards();
      console.log(cards);
      setCards(cards);
    };

    fetchData().catch(console.error);
  }, []);

  const questionColumns: Column<Question>[] = React.useMemo(
    () => [
      {
        Header: <Button variant="ghost">Question Id</Button>,
        accessor: 'question_id',
        width: 50,
        disableFilters: true,
      },
      {
        Header: () => <DifficultyHeader />,
        accessor: 'difficulty',
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: <Button variant="ghost">Link</Button>,
        accessor: 'url',
        Cell: (props) => {
          return <UrlCell url={props.value} />;
        },
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: 'Text',
        accessor: 'text',
      },
      {
        Header: 'Chinese Text',
        accessor: 'translatedText',
      },
      {
        Header: 'Title',
        accessor: settings.lang === 'EN' ? 'title' : 'translatedTitle',
        // Cell: (props: React.PropsWithChildren<CellProps<Question, string>>) => {
        //   return <QuestionCell card={props.row.values as Question} />;
        // },
        disableSortBy: true,
        Filter: TitleColumnFilterComponent,
        //filter: TitleColumnFilter,
      },
      {
        Header: 'Chinese Title',
        accessor: 'translatedTitle',
      },
    ],
    []
  );
  const cardColumns: Column<FlattenedCard>[] = React.useMemo(
    () => [
      {
        Header: <Button variant="ghost">Link</Button>,
        accessor: 'url',
        Cell: (props) => {
          return <UrlCell url={props.value} />;
        },
        disableFilters: true,
      },
      {
        Header: <Button variant="ghost">Created at</Button>,
        accessor: 'created_at',
      },
      {
        Header: 'Is Archived',
        accessor: 'is_archived',
      },
      {
        Header: <Button variant="ghost">Question Id</Button>,
        accessor: 'question_id',
        disableFilters: true,
      },
      {
        Header: () => <DifficultyHeader />,
        accessor: 'difficulty',
        disableFilters: true,
      },

      {
        Header: 'Text',
        accessor: 'text',
      },
      {
        Header: 'Chinese Text',
        accessor: 'translatedText',
      },
      {
        Header: <Button variant="ghost">Title</Button>,
        accessor: settings.lang === 'EN' ? 'title' : 'translatedTitle',
        Cell: (props: React.PropsWithChildren<CellProps<FlattenedCard, string>>) => {
          return <QuestionCell card={props.row.values as FlattenedCard} />;
        },
        // Filter: TitleColumnFilterComponent,
        // filter: TitleColumnFilter,
      },
      {
        Header: 'Chinese Title',
        accessor: 'translatedTitle',
      },
      {
        Header: <Button variant="ghost">Last Repetition Date</Button>,
        accessor: 'last_rep_date',
      },
      {
        Header: <Button variant="ghost">Next Repetition Date</Button>,
        accessor: 'next_rep_date',
      },

      {
        Header: <Button variant="ghost">Stage</Button>,
        accessor: 'stage',
      },
      {
        Header: <Button variant="ghost">Id</Button>,
        accessor: 'id',
      },
    ],
    []
  );

  const filterQuestionByDifficulty = (cardsData: FlattenedCard[]) => {
    if (settings.difficultyType === DifficultyType.ALL) {
      return cardsData;
    }

    return cardsData.filter((card: FlattenedCard) => {
      return card.difficulty.toLowerCase() === settings.difficultyType.toLowerCase();
    });
  };

  console.log(cardsData);
  return (
    <Flex direction="row" justify="center" minH="94vh" bg={bg}>
      {/* <SideBar setDisplayType={setDisplayType} /> */}
      {/* <DataTable columns={cardColumns} data={cardsData} /> */}
      <QuestionTableContainer />
    </Flex>
  );
};
