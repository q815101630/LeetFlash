import { Button } from "@chakra-ui/react";
import { TitleColumnFilterComponent, TitleColumnFilter } from "components/Filters";
import * as React from "react";
import { CellProps, Column, Row } from "react-table";
import { useAppSelector } from "redux/hooks";
import { DifficultyType, selectSettings } from "redux/settings/settingsSlice";
import { fetchCards, fetchQuestions } from "../apis/data.api";
import { DataTable } from "../components/dataTable";
import DifficultyHeader from "../components/DifficultyHeader";
import QuestionCell from "../components/QuestionCell";
import UrlCell from "../components/UrlCell";
import { Card, Question } from "../interfaces/interfaces";
const data: Question[] = [
  {
    question_id: "1",
    difficulty: "hard",
    url: "http://nasd",
    text: "Two sumTwo sumTwo sumTwo sumTwo sumTwo sum",
    translatedText: "Two sumTwo sum",
    title: "Two sumTwo sum",
    translatedTitle: "Two sumTwo sum",
  },
];

// see https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table
// to configure react-table typings

export const Dashboard = () => {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [cards, setCards] = React.useState<Card[]>([]);
  const [difficultyType, setDifficultyType] = React.useState<DifficultyType>(
    DifficultyType.ALL
  );
  const questionsData = React.useMemo(() => [...questions], [questions]);
  const cardsData = React.useMemo(() => [...cards], [cards]);

  const settings = useAppSelector(selectSettings);

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
        Header:<Button variant='ghost'>Question Id</Button>,
        accessor: "question_id",
        disableFilters: true,
      },
      {
        Header: () => <DifficultyHeader />,
        accessor: "difficulty",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: <Button variant='ghost'>Link</Button>,
        accessor: "url",
        Cell: (props) => {
          return <UrlCell url={props.value} />;
        },
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: "Text",
        accessor: "text",
      },
      {
        Header: "Chinese Text",
        accessor: "translatedText",
      },
      {
        Header: "Title",
        accessor: settings.lang === "EN" ? "title" : "translatedTitle",
        Cell: (props: React.PropsWithChildren<CellProps<Question, string>>) => {
          return <QuestionCell question={props.row.values as Question} />;
        },
        disableSortBy: true,
        Filter: TitleColumnFilterComponent,
        filter: TitleColumnFilter,
      },
      {
        Header: "Chinese Title",
        accessor: "translatedTitle",
      },
    ],
    []
  );
  const cardColumns: Column<Card>[] = React.useMemo(
    () => [
      {
        Header: "Creation Date",
        accessor: "created_at",
      },
      {
        Header: "Is Archived",
        accessor: "is_archived",
      },
      {
        Header: "Last Repetition Date",
        accessor: "last_rep_date",
      },
      {
        Header: "Next Repetition Date",
        accessor: "next_rep_date",
      },
      {
        Header: "Question",
        accessor: (data) => {
          return data.question.question_id;
        },
      },
      {
        Header: "Stage",
        accessor: "stage",
      },
      {
        Header: "Id",
        accessor: "id",
      },
    ],
    []
  );

  const filterQuestionByDifficulty = (questionsData: Question[]) => {
    if (settings.difficultyType === DifficultyType.ALL) {
      return questionsData;
    }

    return questionsData.filter((question: Question) => {
      return (
        question.difficulty.toLowerCase() ===
        settings.difficultyType.toLowerCase()
      );
    });
  };

  return (
    <DataTable
      columns={questionColumns}
      data={filterQuestionByDifficulty(questionsData)}
    />
  );
};
