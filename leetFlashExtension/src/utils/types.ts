// export const BASE_URL = "https://leetflash.herokuapp.com";
export const BASE_URL = "http://localhost:3030";
export const VERIFY_URL = `${BASE_URL}/api/auth/verify-api-token`;
export const SEND_QUESTION_API = `${BASE_URL}/api/user/add-question/`;
export const LEETFLASH_DASHBOARD = "https://leetflash.herokuapp.com/dashboard";

export interface TopicTag {
  name: string;
  translatedName: string;
}

export interface SubmissionQuestion {
  questionId: string;

  title: string;
  translatedTitle: string;

  titleSlug: string;
  topicTags: TopicTag[];
  difficulty: string;

  content: string;
  translatedContent: string;
}

export interface SubmissionDetail {
  code: string;
  id: string;
  lang: string;
  rawMemory: string;
  memory: string;
  question: SubmissionQuestion;
  runtime: string;
  sourceUrl: string;
  statusDisplay: string;
  timestamp: number;
}

export interface Reminder {
  titleSlug: string;
  title: string;
  translatedTitle?: string;
  next_rep_date: string;
}
