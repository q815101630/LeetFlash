import {
  getStoredOnlyVisitor,
  incrementEasyCnt,
  incrementHardCnt,
  incrementMediumCnt,
} from "./../utils/storage";
import {
  findOneQuestionInfo,
  getStoredQuestionInfo,
  getStoredUser,
  Languages,
  Question,
  QuestionInfo,
  setStoredQuestionInfo,
  setStoredUser,
  getIsAllowed,
  User,
  setIsAllowed,
  todayTotalIncrement,
  todayACIncrement,
} from "../utils/storage";
import { debounce } from "ts-debounce";
import { sendQuestionToServer } from "../utils/api";
import { MessageType } from "../utils/messages";
import { UserPerformance } from "../utils/storage";
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

export const DefaultUserPerformance = {
  today_ac_count: 0,
  today_num_question: 0,
  avg_memory_percent: 0,
  avg_time_percent: 0,
  num_easy: 0,
  num_medium: 0,
  num_hard: 0,
} as UserPerformance;

export const DefaultUser: User = {
  email: "",
  uuid: "",
  performance: DefaultUserPerformance,
};

chrome.runtime.onInstalled.addListener(() => {
  getStoredUser().then((user) => {
    if (!user) {
      chrome.runtime.openOptionsPage();

      setStoredUser(DefaultUser);
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

const onCompleteHandlerDebounced = (params: any) => {
  console.log(params);
  if (
    params.initiator !== "https://leetcode.com" &&
    params.initiator !== "https://leetcode-cn.com"
  ) {
    return;
  }
  getIsAllowed().then((isAllowed: boolean) => {
    if (isAllowed) {
      onCompleteHandler(params);
    } else {
      console.log("isAllowed is false");
    }
  });
};

const onCompleteHandler = async ({
  url,
}: chrome.webRequest.WebResponseCacheDetails) => {
  setIsAllowed(false).then(async () => {
    timesRequest += 1;
    console.log("timesRequest " + timesRequest);

    const questionUrl = (await getCurrentTab())?.url;
    if (!questionUrl) {
      console.log("questionUrl is null");
      setIsAllowed(true);
      return;
    }
    timesQuery += 1;
    console.log("timesQuery " + timesQuery);
    console.log("url ", url);
    const res: SubmissionResponse = await getJSON(url);
    console.log("totalIncremented");
    todayTotalIncrement().then(() => {
      if (res.status_msg === "Accepted") {
        console.log("AC incremented");
        todayACIncrement().then(async () => {
          console.log("res " + res);
          console.log("question_id " + res.question_id);
          questionInfo = await findOneQuestionInfo(res.question_id);
          console.log("QuestionInfo from GraphQL or front-end");
          console.log(questionInfo);
          if (!questionInfo) {
            console.log(
              "Cannot find question, go back to question page and try again"
            );
            setIsAllowed(true);
            return;
          }
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
            if (res.status_msg === "Accepted") {
              console.log("Accepted");
              switch (difficulty) {
                case "easy":
                  console.log("Easy");
                  incrementEasyCnt();
                  break;
                case "medium":
                  console.log("medium");

                  incrementMediumCnt();
                  break;
                case "hard":
                  console.log("hard");

                  incrementHardCnt();
                  break;
              }
            }

            if (user && user.uuid) {
              console.log("found user and start sending");
              sendQuestionToServer(question, user)
                .then(() => {
                  console.log("sent and set isAllowed to true");
                  setIsAllowed(true);
                })
                .catch(() => {
                  console.log("failed to send");
                  setIsAllowed(true);
                });
            } else {
              console.log("Need to set up User information");
              setIsAllowed(true).then(() => {
                getStoredOnlyVisitor().then((onlyVisitor) => {
                  if (!onlyVisitor) {
                    chrome.runtime.openOptionsPage();
                  }
                });
              });
            }
          });
        });
      }
    });
  });
};

const handleSubmitBtnHit = (msg: any, sender: any, sendResponse: Function) => {
  if (msg == MessageType.SUBMIT) {
    sendResponse();
  }
};
chrome.webRequest.onCompleted.addListener(
  debounce(onCompleteHandlerDebounced, 1000),
  SUBMIT_FILTERS
);
chrome.runtime.onMessage.addListener(handleSubmitBtnHit);

//chrome.runtime.onMessage.addListener(debounce(handleSubmitBtnHit, 3000));
