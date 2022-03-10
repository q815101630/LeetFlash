import { DefaultUserPerformance, Question, User } from "./storage";
import { BASE_URL, SEND_QUESTION_API, VERIFY_URL } from "./types";
import axios from "axios";

export const sendQuestionToServer = (
  question: Question,
  user: User
): Promise<void> => {
  const body = {
    ...question,
  };
  return new Promise((resolve, reject) => {
    fetch(`${SEND_QUESTION_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        uuid: `${user.uuid}`,
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
            uuid: data._id,
            performance: DefaultUserPerformance,
          };

          resolve(returnUser);
        } else {
          reject(res.status);
        }
      });
  });
};
