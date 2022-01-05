export interface SyncStorage {
  user?: User;
}
export interface LocalStorage {
  questionInfos: QuestionInfo[];
  isAllowed?: boolean;
}
export interface QuestionInfo {
  id: string;
  question_id: string;
  difficulty: string;
  title?: string;
  translatedTitle?: string;
  text?: string;
  translatedText?: string;
}

export interface Question {
  id: string;
  question_id: string;
  difficulty: string;
  title: string;
  translatedTitle?: string;
  text?: string;
  translatedText?: string;
  url: string;
  status_memory: string;
  status_msg: string;
  status_runtime: string;
}

export enum languages {
  CN,
  EN,
}

export interface User {
  email: string;
  uuid: string;
  language: languages;
}

export type SyncStorageKeys = keyof SyncStorage;
export type LocalStorageKeys = keyof LocalStorage;

export const setIsAllowed = (isAllowed: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ isAllowed }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
};

export const getIsAllowed = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["isAllowed"], (res: LocalStorage) => {
      resolve(res.isAllowed);
    });
  });
};

export const setStoredQuestionInfo = (
  questionInfos: QuestionInfo[]
): Promise<void> => {
  const vals: LocalStorage = {
    questionInfos,
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

export const getStoredQuestionInfo = (): Promise<QuestionInfo[]> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["questionInfos"], (res: LocalStorage) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res.questionInfos);
      }
    });
  });
};

export const findOneQuestionInfo = (
  question_id: string
): Promise<QuestionInfo> => {
  return new Promise((resolve, reject) => {
    getStoredQuestionInfo().then((questionInfos) => {
      const currentQuestions: QuestionInfo = questionInfos.find((q) => {
        return question_id === q.question_id;
      });
      return resolve(currentQuestions);
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
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res.user);
      }
    });
  });
};
