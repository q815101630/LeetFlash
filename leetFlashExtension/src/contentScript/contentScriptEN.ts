import {
  getStoredQuestionInfosEN,
  QuestionInfo,
  setStoredQuestionInfosEN,
} from "../utils/storage";

window.addEventListener(
  "getQuestionInfoFromEN",
  (data: any) => {
    const questionInfo: QuestionInfo = data.detail;
    console.log(questionInfo);
    getStoredQuestionInfosEN().then((storedQuestionInfo) => {
      const currentQuestions = storedQuestionInfo.find((q) => {
        return q.question_id === questionInfo.question_id && q.title;
      });
      if (!currentQuestions) {
        setStoredQuestionInfosEN([...storedQuestionInfo, questionInfo]).then(
          () => {
            getStoredQuestionInfosEN().then((storedQuestionInfo) => {
              console.log("save success");
              console.log(storedQuestionInfo);
            });
          }
        );
      }
    });
  },
  false
);
