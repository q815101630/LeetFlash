export interface SyncStorage {
  user?: User;
}
export interface LocalStorage {
  questionInfosEN?: QuestionInfo[];
  questionInfosCN?: QuestionInfo[];
}
export interface QuestionInfo {
  id: string;
  question_id: string;
  difficulty: string;
  title?: string;
  translatedTitle?: string;
  text?: string;
  translatedText?: string;
  site: Site;
}

export interface Question {
  id: string;
  difficulty: string;
  title: string;
  translatedTitle?: string;
  text?: string;
  translatedText?: string;
  url: string;
  status_memory: string;
  status_msg: string;
  status_runtime: string;
  site: Site;
}

export enum languages {
  CN,
  EN,
}
export enum Site {
  EN = "EN",
  CN = "CN",
}

export interface User {
  email: string;
  uuid: string;
  language: languages;
}

export type SyncStorageKeys = keyof SyncStorage;
export type LocalStorageKeys = keyof LocalStorage;

export const setStoredQuestionInfosCN = (
  questionInfosCN: QuestionInfo[]
): Promise<void> => {
  const vals: LocalStorage = {
    questionInfosCN,
  };
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(vals, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
};

export const getStoredQuestionInfosCN = (): Promise<QuestionInfo[]> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["questionInfosCN"], (res: LocalStorage) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res.questionInfosCN);
      }
    });
  });
};

export const setStoredQuestionInfosEN = (
  questionInfosEN: QuestionInfo[]
): Promise<void> => {
  const vals: LocalStorage = {
    questionInfosEN,
  };
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(vals, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
};

export const getStoredQuestionInfosEN = (): Promise<QuestionInfo[]> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["questionInfosEN"], (res: LocalStorage) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res.questionInfosEN);
      }
    });
  });
};

export const setStoredUser = (user: User): Promise<void> => {
  const vals: SyncStorage = {
    user,
  };
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(vals, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
};

export const getStoredUser = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["user"], (res: SyncStorage) => {
      console.log("getStoredUser" + res);
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res.user);
      }
    });
  });
};
