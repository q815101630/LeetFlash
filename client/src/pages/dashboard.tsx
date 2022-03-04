import * as React from "react";
import { Column } from "react-table";
import { fetchCards, fetchQuestions } from "../apis/data.api";
import { DataTable } from "../components/dataTable";
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
  const questionsData = React.useMemo(() => [...questions], [questions]);
  const cardsData = React.useMemo(() => [...cards], [cards]);
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
        Header: "Question Id",
        accessor: "question_id",
      },
      {
        Header: "Difficulty",
        accessor: "difficulty",
      },
      {
        Header: "Url",
        accessor: "url",
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
        accessor: "title",
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
  return <DataTable columns={questionColumns} data={questionsData} />;
};
