import {
  findOneQuestionInfo,
  getStoredQuestionInfo,
  getStoredUser,
  languages,
  Question,
  QuestionInfo,
  setStoredQuestionInfo,
  setStoredUser,
  getIsAllowed,
  setIsAllowed,
} from "../utils/storage";
import { debounce } from "ts-debounce";
import { sendQuestionToServer } from "../utils/api";
import { MessageType } from "../utils/messages";
const SUBMIT_FILTERS = {
  urls: [
    "https://leetcode.com/submissions/detail/*/check/",
    "https://leetcode-cn.com/submissions/detail/*/check/",
  ],
};

export interface SubmissionResponse {
  question_id: string;
  status_msg: string;
  status_runtime: string;
  status_memory: string;
}

chrome.runtime.onInstalled.addListener(() => {
  getStoredUser().then((user) => {
    if (!user) {
      chrome.runtime.openOptionsPage();
      setStoredUser({
        email: "",
        uuid: "",
        language: languages.EN,
      });
    }
  });
  setIsAllowed(true);
  setStoredQuestionInfo([]);
});

// chrome.webRequest.onBeforeRequest.addListener(() => {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     const msg: Message = {
//       info: {
//         url: tabs[0].url,
//       },
//       msg: MessageType.GET_QUESTION_INFO,
//     };

//     chrome.tabs.sendMessage(tabs[0].id, msg, (info: QuestionInfo) => {
//       id = info.id;
//       difficulty = info.difficulty;
//       title = info.title;
//       translatedTitle = info.translatedTitle;
//       text = info.text;
//       translatedText = info.translatedText;
//     });
//   });
// }, SUBMIT_FILTERS);

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const getJSON = async (url: string) => {
  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    });
};
let questionInfo: QuestionInfo;

let timesRequest = 0;
let timesQuery = 0;

const onCompleteHandler = async ({
  url,
}: chrome.webRequest.WebResponseCacheDetails) => {
  console.log("86 86 86 86");
  getIsAllowed().then((isAllowed) => {
    console.log("isAllowed " + isAllowed);
    if (isAllowed) {
      setIsAllowed(false).then(async () => {
        timesRequest += 1;
        console.log("timesRequest " + timesRequest);

        const questionUrl = (await getCurrentTab()).url;

        timesQuery += 1;
        console.log("timesQuery " + timesQuery);
        const res: SubmissionResponse = await getJSON(url);

        questionInfo = await findOneQuestionInfo(res.question_id);
        console.log("QuestionInfo from GraphQL or front-end");
        console.log(questionInfo);
        const {
          id,
          question_id,
          difficulty,
          title,
          translatedTitle,
          text,
          translatedText,
        } = questionInfo;

        const question: Question = {
          id,
          question_id,
          url: questionUrl,
          difficulty,
          title,
          translatedTitle,
          text,
          translatedText,
          status_memory: res.status_memory,
          status_runtime: res.status_runtime,
          status_msg: res.status_msg,
        };
        console.log("Final question to send:");
        console.log(question);
        getStoredUser().then((user) => {
          if (user && user.uuid) {
            console.log("found user and start sending");
            sendQuestionToServer(question, user)
              .then(() => {
                setIsAllowed(true);
              })
              .catch(() => {
                setIsAllowed(true);
              });
          } else {
            console.log("Need to set up User information");
            chrome.runtime.openOptionsPage(() => {
              setIsAllowed(true);
            });
          }
        });
      });
    }
  });
};

const handleSubmitBtnHit = (msg: any, sender: any, sendResponse: Function) => {
  if (msg == MessageType.SUBMIT) {
    sendResponse();
  }
};
chrome.webRequest.onCompleted.addListener(onCompleteHandler, SUBMIT_FILTERS);
chrome.runtime.onMessage.addListener(handleSubmitBtnHit);

//chrome.runtime.onMessage.addListener(debounce(handleSubmitBtnHit, 3000));
