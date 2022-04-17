export interface TopicTag {
  name: string;

  translatedName?: string;
}

export interface Question {
  questionId: string;
  title: string;
  translatedTitle?: string;
  difficulty: 'Easy' | 'Hard' | 'Medium';

  url: string;

  translatedUrl: string;

  topicTags?: TopicTag[];

  content: string;

  translatedContent?: string;
}

export interface Card {
  question: Question;

  next_rep_date: Date;

  stage: number;

  total_stages: number[];

  is_archived: boolean;

  last_rep_date: Date;

  created_at: Date;

  id: string;

  note?: string;

  code?: string;

  lang: string;

  rawMemory: number;

  runtime: number;
}
