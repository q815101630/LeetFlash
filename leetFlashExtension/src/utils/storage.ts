export interface SyncStorage {
  user: User;
  remindSettings: RemindSettings;
}

export interface LocalStorage {
  submissionIds: string[];
  onlyVisitor: false;
  date: string;
}

export interface RemindSettings {
  timeSlots: number[];
  delayMins: number;
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
  _id: "",
  performance: DefaultUserPerformance,
};

//[9, 12, 15, 18, 21]
export const DefaultRemindSettings: RemindSettings = {
  timeSlots: [540, 720, 900, 1080, 1260],
  delayMins: 30,
};

export interface Question {
  id: string;
  question_id: string;
  difficulty: string;
  title: string;
  translated_title?: string;
  text?: string;
  translated_text?: string;
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
  _id: string;
  performance: UserPerformance;
}

export type SyncStorageKeys = keyof SyncStorage;
export type LocalStorageKeys = keyof LocalStorage;

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
      // console.log(user.performance.finishedEasy);
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

export const setStoredSubmissionIds = (
  submissionIds: string[]
): Promise<void> => {
  const vals = {
    submissionIds,
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

export const getStoredSubmissionIds = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ submissionIds: [] }, (res: LocalStorage) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res.submissionIds);
      }
    });
  });
};

export const findOneSubmissionId = (submissionId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    getStoredSubmissionIds().then((submissionIds) => {
      const curId = submissionIds.find((i) => {
        return submissionId === i;
      });
      return resolve(curId);
    });
  });
};

export const setStoredUser = (user: User): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ user }, () => {
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

export const setStoredRemindSettings = (
  remindSettings: RemindSettings
): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(remindSettings, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
};

export const getStoredRemindSettings = (): Promise<RemindSettings> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["remindSettings"], (res: SyncStorage) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(res.remindSettings);
      }
    });
  });
};

export const todayACIncrement = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["user"], async (res: SyncStorage) => {
      if (chrome.runtime.lastError) {
        // console.log(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        const user = res.user;
        if (user) {
          user.performance.today_ac_count += 1;
          await setStoredUser(user);
          resolve();
        }
      }
    });
  });
};

export const todayTotalIncrement = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["user"], (res: SyncStorage) => {
      if (chrome.runtime.lastError) {
        // console.log(chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError.message);
      } else {
        const user = res.user;
        console.log(user);
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
      if (!user) {
        user = DefaultUser;
      }
      user.performance = DefaultUserPerformance;
      setStoredUser(user)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  });
};

export const setDate = (date: Date): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dateJSON = date.toJSON();
    chrome.storage.local.set({ date: dateJSON }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve();
      }
    });
  });
};

export const getDate = (): Promise<Date> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["date"], (res: LocalStorage) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(new Date(res.date));
      }
    });
  });
};
