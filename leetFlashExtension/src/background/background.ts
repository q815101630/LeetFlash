import {
  getStoredQuestionInfo,
  getStoredUser,
  Question,
  QuestionInfo,
  setStoredUser,
} from "../utils/storage";

import { sendQuestionToServer } from "../utils/api";
const SUBMIT_FILTERS = {
  urls: [
    "*://leetcode.com/submissions/detail/*/check/",
    "*://leetcode-cn.com/submissions/detail/*/check/",
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
    }
  });
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

chrome.webRequest.onCompleted.addListener(
  (details: chrome.webRequest.WebResponseCacheDetails) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      fetch(details.url)
        .then((res) => res.json())
        .then((res: SubmissionResponse) => {
          getStoredQuestionInfo().then(
            ({
              id,
              difficulty,
              title,
              translatedTitle,
              text,
              translatedText,
            }) => {
              console.log("background.ts:");
              console.log(
                id,
                difficulty,
                title,
                translatedTitle,
                text,
                translatedText
              );
              const question: Question = {
                id,
                difficulty,
                title,
                translatedTitle,
                text,
                translatedText,
                url: tabs[0].url,
                status_memory: res.status_memory,
                status_runtime: res.status_runtime,
                status_msg: res.status_msg,
              };
              getStoredUser().then((user) => {
                if (user) {
                  sendQuestionToServer(question, user);
                } else {
                  chrome.runtime.openOptionsPage();
                }
              });
            }
          );
        });
    });
  },
  SUBMIT_FILTERS
);
