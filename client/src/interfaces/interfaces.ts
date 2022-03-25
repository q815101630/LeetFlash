export interface Question {
  question_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  translated_url?: string;
  url: string;
  text: string;
  translatedText: string;
  title: string;
  translatedTitle: string;
}

export interface Card {
  created_at: Date;
  is_archived: boolean;
  last_rep_date: Date;
  next_rep_date: Date;
  question: Question;
  stage: number;
  max_stage?: number;
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
