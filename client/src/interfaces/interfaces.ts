export interface Question {
  question_id: string;
  difficulty: string;
  url: string;
  text: string;
  translatedText: string;
  title: string;
  translatedTitle: string;
}

export interface Card {
  created_at: string;
  is_archived: boolean;
  last_rep_date: string;
  next_rep_date: string;
  question: Question;
  stage: number;
  id: string;
}

export interface FlattenedCard {
  created_at: string;
  is_archived: boolean;
  last_rep_date: string;
  next_rep_date: string;
  stage: number;
  id: string;

  question_id: string;
  difficulty: string;
  url: string;
  text: string;
  translatedText: string;
  title: string;
  translatedTitle: string;
}
