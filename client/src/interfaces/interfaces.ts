export interface Question {
  question_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  translated_url?: string;
  url: string;
  text: string;
  translated_text: string;
  title: string;
  translated_title: string;
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
  note?: string;
}