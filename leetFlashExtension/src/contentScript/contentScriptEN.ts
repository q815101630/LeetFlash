import { MessageType } from "../utils/messages";
import {
  getStoredQuestionInfo,
  QuestionInfo,
  setStoredQuestionInfo,
} from "../utils/storage";

const handleEvent = (data: any) => {
  const questionInfo: QuestionInfo = data.detail;
  // console.log(questionInfo);
  getStoredQuestionInfo().then((storedQuestionInfo) => {
    const currentQuestionIdx = storedQuestionInfo.findIndex((q) => {
      return q.question_id === questionInfo.question_id;
    });
    if (currentQuestionIdx === -1) {
      setStoredQuestionInfo([...storedQuestionInfo, questionInfo]).then(() => {
        getStoredQuestionInfo().then((storedQuestionInfo) => {
          // console.log("save success");
          // console.log(storedQuestionInfo);
        });
      });
    } else {
      storedQuestionInfo[currentQuestionIdx].title = questionInfo.title;
      storedQuestionInfo[currentQuestionIdx].text = questionInfo.text;


      setStoredQuestionInfo(storedQuestionInfo).then(() => {
        getStoredQuestionInfo().then((storedQuestionInfo) => {
          // console.log("update success");
          // console.log(storedQuestionInfo);
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
