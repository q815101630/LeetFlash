export interface SyncStorage {
  user?: User;
}
export interface LocalStorage {
  questionInfo: QuestionInfo;
}
export interface QuestionInfo {
  id: string;
  difficulty: string;
  title?: string;
  translatedTitle?: string;
  text?: string;
  translatedText?: string;
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
}

export interface User {
  email: string;
  uuid: string;
}

export type SyncStorageKeys = keyof SyncStorage;
export type LocalStorageKeys = keyof LocalStorage;

export const setStoredQuestionInfo = (
  questionInfo: QuestionInfo
): Promise<void> => {
  const vals: LocalStorage = {
    questionInfo,
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

export const getStoredQuestionInfo = (): Promise<QuestionInfo> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["questionInfo"], (res: LocalStorage) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res.questionInfo);
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
