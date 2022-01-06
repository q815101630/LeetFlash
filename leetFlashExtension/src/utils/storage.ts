export interface SyncStorage {
  user?: User;
}
export interface LocalStorage {
  questionInfos: QuestionInfo[];
  isAllowed?: boolean;
  onlyVisitor: false;
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

export interface UserPerformance {
  today_ac_count: number;
  today_num_question: number;
  avg_memory_percent: number;
  avg_time_percent: number;
  num_easy: number;
  num_medium: number;
  num_hard: number;
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

export enum Languages {
  CN,
  EN,
}

export interface User {
  email: string;
  uuid: string;
  performance: UserPerformance;
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

export const getIsAllowed = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["isAllowed"], (res: LocalStorage) => {
      resolve(res.isAllowed);
    });
  });
};

export const setStoredOnlyVisitor = (onlyVisitor: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ onlyVisitor }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
};

export const getStoredOnlyVisitor = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["onlyVisitor"], (res: LocalStorage) => {
      resolve(res.onlyVisitor);
    });
  });
};

export const incrementEasyCnt = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["user"], (res: SyncStorage) => {
      const { user } = res;
      user.performance.num_easy += 1;
      console.log("incrementEasyCnt " + user.performance.num_easy);
      setStoredUser(user)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
};

export const incrementHardCnt = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["user"], (res: SyncStorage) => {
      const { user } = res;
      user.performance.num_hard += 1;
      setStoredUser(user)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
};

export const incrementMediumCnt = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["user"], (res: SyncStorage) => {
      const { user } = res;
      user.performance.num_medium += 1;
      setStoredUser(user)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
};

export const setStoredQuestionInfo = (
  questionInfos: QuestionInfo[]
): Promise<void> => {
  const vals = {
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

export const todayACIncrement = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["user"], (res: SyncStorage) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        const user = res.user;
        if (user) {
          user.performance.today_ac_count += 1;
          setStoredUser(user).then(() => resolve());
        }
      }
    });
  });
};

export const todayTotalIncrement = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["user"], (res: SyncStorage) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        const user = res.user;
        if (user) {
          user.performance.today_num_question += 1;
          setStoredUser(user).then(() => resolve());
        }
      }
    });
  });
};
