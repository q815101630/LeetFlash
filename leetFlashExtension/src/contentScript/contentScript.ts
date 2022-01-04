// You can use `browser`/`chrome` here and interact with extension stuff like storage and tabs.
/* Inject ,currently not in use*/
// const s = document.createElement("script");
// s.src = chrome.runtime.getURL("injected.js");
// s.onload = async function () {
//   (this as any).remove();
// };
// (document.head || document.documentElement).appendChild(s);

import { Message, MessageType } from "../utils/messages";
import { QuestionInfo, setStoredQuestionInfo } from "../utils/storage";

const QUESTION_TITLE_EN = "[data-cy='question-title']";
const QUESTION_TITLE_CN = "[data-cypress='QuestionTitle']";
const SEPARATOR_TOKEN = ". ";
const DIFFICULTY_EN = "[diff]";
const DIFFICULTY_CN = "[data-degree]";
const CONTENT_EN = "[class*=question-content]";
const CONTENT_CN = "[class*=content] .notranslate";

console.log("contentScript.ts");

// Extract question data from LeetCode page
// chrome.runtime.onMessage.addListener(
//   (msg: Message, sender, sendResponse: Function) => {
//     console.log(msg);
//     if (msg.msg === MessageType.GET_QUESTION_INFO) {

//     }
//   }
// );

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
    if (
      (document.querySelector(CONTENT_EN) &&
        document.querySelector(DIFFICULTY_EN) &&
        document.querySelector(QUESTION_TITLE_EN)) ||
      (document.querySelector(CONTENT_CN) &&
        document.querySelector(DIFFICULTY_CN) &&
        document.querySelector(QUESTION_TITLE_CN) &&
        document.querySelector('meta[property="og:site_name"]'))
    ) {
      clearInterval(jsInitChecktimer);
      // DO YOUR STUFF HERE.

      /* leetcode.com */
      if (!Boolean(document.querySelector('meta[property="og:site_name"]'))) {
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
        /* leetcode-cn.com */
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
      const [id, name] = titleElement.innerHTML.split(SEPARATOR_TOKEN);

      const questionInfo: QuestionInfo = {
        id: id.trim(),
        difficulty: difficulty,
        title: isEN ? name.trim() : undefined,
        translatedTitle: isEN ? undefined : name.trim(),
        text: isEN ? content : undefined,
        translatedText: isEN ? undefined : content,
      };
      console.log("questionInfo");
      console.log(questionInfo);
      setStoredQuestionInfo(questionInfo);
    }
  }
}
