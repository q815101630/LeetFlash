import { Question, User } from "./storage";

const SEND_QUESTION_API = "http://localhost:3000/api/user/add-question/";

export const sendQuestionToServer = (
  question: Question,
  user: User
): Promise<void> => {
  const body = {
    ...question,
  };
  return new Promise((resolve, reject) => {
    // fetch(`${SEND_QUESTION_API}${user.email}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     uuid: `${user.uuid}`,
    //   },
    //   body: JSON.stringify(body),
    // })
    //   .then((res) => {
    //     if (res.status === 200 || res.status === 201) {
    //       resolve();
    //     } else {
    //       reject(res.statusText);
    //     }
    //   })
    //   .catch((err) => {
    //     reject(err);
    //   });
    resolve();
  });
};
