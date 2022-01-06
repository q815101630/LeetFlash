// You can use `browser`/`chrome` here and interact with extension stuff like storage and tabs.
/* Inject ,currently not in use*/
// const s = document.createElement("script");
// s.src = chrome.runtime.getURL("injected.js");
// s.onload = async function () {
//   (this as any).remove();
// };
// (document.head || document.documentElement).appendChild(s);

import { Message, MessageType } from "../utils/messages";
import {
  getStoredQuestionInfo,
  QuestionInfo,
  setStoredQuestionInfo,
} from "../utils/storage";

const QUESTION_TITLE_EN = "[data-cy='question-title']";
const DIFFICULTY_EN = "[diff]";
const CONTENT_EN = "[class*=question-content]";
const QUESTION_TITLE_CN = "[data-cypress='QuestionTitle']";
const SEPARATOR_TOKEN = ". ";
const DIFFICULTY_CN = "[data-degree]";
const CONTENT_CN = "[class*=content] .notranslate";
const QUESTION_ID = "[name='question']";
const SUBMIT_BTN = "[data-cypress='SubmitCode']";
console.log("contentScript.ts");

let titleElement: Element;
let contentElement: any;
let isEN: boolean;
let content: string;
let difficulty: string;
let difficultyTag: HTMLElement;
window.addEventListener("load", myMain, false);

function myMain(evt) {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  function checkForJS_Finish() {
    // if (document.querySelector(SUBMIT_BTN)) {
    //   chrome.runtime.sendMessage(MessageType.INCREMENT_SUBMIT);
    // }

    if (
      (document.querySelector(CONTENT_EN) &&
        document.querySelector(DIFFICULTY_EN) &&
        document.querySelector(QUESTION_TITLE_EN)) ||
      (document.querySelector(CONTENT_CN) &&
        document.querySelector(DIFFICULTY_CN) &&
        document.querySelector(QUESTION_TITLE_CN) &&
        document.querySelector('meta[property="og:site_name"]') &&
        document.querySelector(QUESTION_ID))
    ) {
      clearInterval(jsInitChecktimer);
      // DO YOUR STUFF HERE.

      /* leetcode.com
       * this is moved to contenrScriptEN.ts
       * Never run
       */
      if (
        false /* !Boolean(document.querySelector('meta[property="og:site_name"]')) */
      ) {
        // title and content must be English
        titleElement = document.querySelector(QUESTION_TITLE_EN);
        contentElement = document.querySelector(CONTENT_EN).firstElementChild;
        content = contentElement.innerText
          .replace(/\n/g, " ")
          .split("Example")[0]
          .trim();

        difficultyTag = document.querySelector(DIFFICULTY_EN) as HTMLElement;
        difficulty = difficultyTag.innerText;
        isEN = true;
      } else {
        /* leetcode-cn.com
         * always run
         */
        // title and content may be English or Chinese
        titleElement =
          document.querySelector(QUESTION_TITLE_CN).firstElementChild;
        contentElement = document.querySelector(CONTENT_CN);

        difficultyTag = document.querySelector(DIFFICULTY_CN) as HTMLElement;
        difficulty = difficultyTag.dataset.degree;
        if (contentElement.innerText.includes("示例")) {
          content = contentElement.innerText
            .replace(/\n/g, " ")
            .split("示例")[0]
            .trim();

          isEN = false;
        } else {
          content = contentElement.innerText
            .replace(/\n/g, " ")
            .split("Example")[0]
            .trim();

          isEN = true;
        }
      }

      const question_id = document
        .querySelector(QUESTION_ID)
        .getAttribute("value");

      const [id, name] = titleElement.innerHTML.split(SEPARATOR_TOKEN);

      const questionInfo: QuestionInfo = {
        id: id.trim(),
        question_id: question_id.trim(),
        difficulty: difficulty,
        title: isEN ? name.trim() : undefined,
        translatedTitle: isEN ? undefined : name.trim(),
        text: isEN ? content : undefined,
        translatedText: isEN ? undefined : content,
      };
      console.log("questionInfo");
      console.log(questionInfo);
      getStoredQuestionInfo().then((storedQuestionInfo) => {
        let curQuestionIdx: number;

        curQuestionIdx = storedQuestionInfo.findIndex((q) => {
          return q.question_id === questionInfo.question_id;
        });
        if (curQuestionIdx === -1) {
          setStoredQuestionInfo([...storedQuestionInfo, questionInfo]).then(
            () => {
              getStoredQuestionInfo().then((storedQuestionInfo) => {
                console.log("save success");
                console.log(storedQuestionInfo);
              });
            }
          );
        } else {
          if (storedQuestionInfo[curQuestionIdx].title) {
            storedQuestionInfo[curQuestionIdx].translatedTitle =
              questionInfo.translatedTitle;
            storedQuestionInfo[curQuestionIdx].translatedText =
              questionInfo.translatedText;
          } else {
            storedQuestionInfo[curQuestionIdx].title = questionInfo.title;
            storedQuestionInfo[curQuestionIdx].text = questionInfo.text;
          }
          setStoredQuestionInfo(storedQuestionInfo).then(() => {
            getStoredQuestionInfo().then((storedQuestionInfo) => {
              console.log("update success");
              console.log(storedQuestionInfo);
            });
          });
        }
      });
    }
  }
}

const handleSubmitIncrement = () => {
  console.log("handling Submit at contentScript");
  chrome.runtime.sendMessage(MessageType.SUBMIT, () => {});
};
window.addEventListener("submitBtnHit", handleSubmitIncrement, false);
