import { MessageType } from "../utils/messages";
import {
  getStoredQuestionInfo,
  QuestionInfo,
  setStoredQuestionInfo,
} from "../utils/storage";

const handleEvent = (data: any) => {
  const questionInfo: QuestionInfo = data.detail;
  console.log(questionInfo);
  getStoredQuestionInfo().then((storedQuestionInfo) => {
    const currentQuestions = storedQuestionInfo.find((q) => {
      return q.question_id === questionInfo.question_id && q.title;
    });
    if (!currentQuestions) {
      setStoredQuestionInfo([...storedQuestionInfo, questionInfo]).then(() => {
        getStoredQuestionInfo().then((storedQuestionInfo) => {
          console.log("save success");
          console.log(storedQuestionInfo);
        });
      });
    }
  });
};

const handleSubmitIncrement = () => {
  chrome.runtime.sendMessage(MessageType.SUBMIT, () => {});
};

window.addEventListener("getQuestionInfoFromEN", handleEvent, false);
window.addEventListener("submitBtnHit", handleSubmitIncrement, false);
window.addEventListener("beforeunload", function (event) {
  window.removeEventListener("getQuestionInfoFromEN", handleEvent);
});
