import {
  Flex,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from 'redux/hooks';
import { selectSettings } from 'redux/settings/settingsSlice';
import { settingsState } from '../redux/settings/settingsSlice';
import { FlattenedCard, Question } from '../interfaces/interfaces';

interface QuestionCellProps {
  card: FlattenedCard;
}

const showContentByLang = (settings: settingsState, text: string, translatedText: string) => {
  return settings.lang === 'EN' ? (text ? text : translatedText) : translatedText ? translatedText : text;
};

const QuestionCell = ({ card }: QuestionCellProps) => {
  const settings = useAppSelector(selectSettings);

  const question: Question = {
    question_id: card.question_id,
    difficulty: 'easy',
    url: card.url,
    text: card.text,
    translatedText: card.translatedText,
    title: card.title,
    translatedTitle: card.translatedTitle,
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost">{showContentByLang(settings, question.title, question.translatedTitle)}</Button>
      </PopoverTrigger>
      <QuestionPopOver question={question} settings={settings} />
    </Popover>
  );
};

interface QuestionPopOverProps {
  question: Question;
  settings: settingsState;
}

const QuestionPopOver = ({ question, settings }: QuestionPopOverProps) => {
  return (
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>{showContentByLang(settings, question.title, question.translatedTitle)}</PopoverHeader>
      <PopoverBody>{showContentByLang(settings, question.text, question.translatedText)}</PopoverBody>
    </PopoverContent>
  );
};

export default QuestionCell;
