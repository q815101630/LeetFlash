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
  finishedEasy: string[];
  finishedMedium: string[];
  finishedHard: string[];
}

export interface SubmissionResponse {
  question_id: string;
  status_msg: string;
  status_runtime: string;
  status_memory: string;
}

export const DefaultUserPerformance = {
  today_ac_count: 0,
  today_num_question: 0,
  avg_memory_percent: 0,
  avg_time_percent: 0,
  num_easy: 0,
  num_medium: 0,
  num_hard: 0,
  finishedEasy: [],
  finishedMedium: [],
  finishedHard: [],
} as UserPerformance;

export const DefaultUser: User = {
  email: "",
  uuid: "",
  performance: DefaultUserPerformance,
};

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

// export const incrementEasyCnt = (): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     chrome.storage.sync.get(["user"], (res: SyncStorage) => {
//       const { user } = res;
//       user.performance.num_easy += 1;
//       console.log("incrementEasyCnt " + user.performance.num_easy);
//       setStoredUser(user)
//         .then(() => resolve())
//         .catch((err) => reject(err));
//     });
//   });
// };

// export const incrementHardCnt = (): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     chrome.storage.sync.get(["user"], (res: SyncStorage) => {
//       const { user } = res;
//       user.performance.num_hard += 1;
//       setStoredUser(user)
//         .then(() => resolve())
//         .catch((err) => reject(err));
//     });
//   });
// };

// export const incrementMediumCnt = (): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     chrome.storage.sync.get(["user"], (res: SyncStorage) => {
//       const { user } = res;
//       user.performance.num_medium += 1;
//       setStoredUser(user)
//         .then(() => resolve())
//         .catch((err) => reject(err));
//     });
//   });
// };

export const addQuestionToSet = (
  question_id: string,
  question_type: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    getStoredUser().then((user) => {
      let tempSet: Set<string>;
      console.log(user.performance.finishedEasy);
      if (question_type === "easy") {
        tempSet = new Set(user.performance.finishedEasy);
        tempSet.add(question_id);
        user.performance.finishedEasy = Array.from(tempSet);
      } else if (question_type === "medium") {
        tempSet = new Set(user.performance.finishedMedium);
        tempSet.add(question_id);
        user.performance.finishedMedium = Array.from(tempSet);
      } else if (question_type === "hard") {
        tempSet = new Set(user.performance.finishedHard);
        tempSet.add(question_id);
        user.performance.finishedHard = Array.from(tempSet);
      }
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

export const clearTodayPerformance = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    getStoredUser().then((user) => {
      user.performance = DefaultUserPerformance;
      setStoredUser(user)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
};
