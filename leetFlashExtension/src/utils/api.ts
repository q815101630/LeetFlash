import axios from "axios";
import {
  DefaultUserPerformance,
  getStoredOnlyVisitor,
  getStoredUser,
  User,
} from "./storage";
import {
  BASE_URL,
  Reminder,
  SEND_QUESTION_API,
  SubmissionDetail,
  VERIFY_URL,
} from "./types";

export const sendQuestionToServer = (
  submissionDetail: SubmissionDetail,
  user: User
): Promise<void> => {
  const body = {
    ...submissionDetail,
  };
  return new Promise((resolve, reject) => {
    fetch(`${SEND_QUESTION_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        uuid: `${user._id}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          resolve();
        } else {
          reject(res.statusText);
        }
      })
      .catch((err) => {
        reject(err);
      });
    resolve();
  });
};

interface returnUserData {
  email: string;
  _id: string;
}

/**
 * A api function to verify user by uuid
 * @param uuid string uuid
 */
export const verifyUser = (uuid: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    axios
      .post<returnUserData>(VERIFY_URL, {
        token: uuid,
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const { data } = res;

          const returnUser: User = {
            email: data.email,
            _id: data._id,
            performance: DefaultUserPerformance,
          };

          resolve(returnUser);
        } else {
          reject(res.status);
        }
      });
  });
};

export const fetchRemindersToday = (): Promise<Reminder[]> => {
  return new Promise((resolve, reject) => {
    getStoredOnlyVisitor()
      .then((onlyVisitor) => {
        if (onlyVisitor) {
          resolve([]);
        }
      })
      .then(() => getStoredUser())
      .then((user) => {
        if (!user || !user._id) return resolve([]);
        return user;
      })
      .then((user: User) => {


        fetch(`${BASE_URL}/api/user/cards-today/${user._id}`, {
          method: "GET",
        }).then((res) => {
          if (res.status === 200 || res.status === 201) {
            res
              .json()
              .then((data) => {
                resolve(data);
              })
              .catch(() => {
                reject(res.status);
              });
          }
        });
      });
  });
};
