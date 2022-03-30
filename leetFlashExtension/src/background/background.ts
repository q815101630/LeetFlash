import {
  addQuestionToSet,
  clearTodayPerformance,
  DefaultUser,
  getDate,
  getStoredOnlyVisitor,
  setDate,
  SubmissionResponse,
} from "./../utils/storage";
import {
  findOneQuestionInfo,
  getStoredUser,
  Question,
  QuestionInfo,
  setStoredQuestionInfo,
  setStoredUser,
  User,
  todayTotalIncrement,
  todayACIncrement,
} from "../utils/storage";
import { sendQuestionToServer } from "../utils/api";
import { MessageType } from "../utils/messages";
import { UserPerformance } from "../utils/storage";
import { debounce } from "ts-debounce";
const SUBMIT_FILTERS = {
  urls: [
    "https://leetcode.com/submissions/detail/*/check/",
    "https://leetcode-cn.com/submissions/detail/*/check/",
  ],
};

chrome.runtime.onInstalled.addListener(() => {
  getStoredUser().then((user) => {
    if (!user) {
      chrome.runtime.openOptionsPage();

      setStoredUser(DefaultUser);
    }
  });
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
  //console.log(params);
  if (
    params.initiator !== "https://leetcode.com" &&
    params.initiator !== "https://leetcode-cn.com"
  ) {
    return;
  }
  checkIfNewDay().then(() => {
    onCompleteHandler(params);
  });
};

const onCompleteHandler = async ({
  url,
}: chrome.webRequest.WebResponseCacheDetails) => {
  timesRequest += 1;
  // console.log("timesRequest " + timesRequest);

  let questionUrl = (await getCurrentTab())?.url;
  if (!questionUrl) {
    // console.log("questionUrl is null");
    return;
  }

  questionUrl = questionUrl.split("/")[questionUrl.split("/").length-3];

  timesQuery += 1;
  // console.log("timesQuery " + timesQuery);
  // console.log("url ", url);
  const res: SubmissionResponse = await getJSON(url);
  // console.log("totalIncremented");
  todayTotalIncrement().then(() => {
    if (res.status_msg === "Accepted") {
      // console.log("AC incremented");
      todayACIncrement().then(async () => {
        // console.log("res " + res);
        // console.log("question_id " + res.question_id);
        questionInfo = await findOneQuestionInfo(res.question_id);
        // console.log("QuestionInfo from GraphQL or front-end");
        // console.log(questionInfo);
        if (!questionInfo) {
          // console.log(
          //   "Cannot find question, go back to question page and try again"
          // );
          return;
        }
        const {
          id,
          question_id,
          difficulty,
          title,
          translated_title,
          text,
          translated_text,
        } = questionInfo;

        const question: Question = {
          id,
          question_id,
          url: questionUrl,
          difficulty,
          title,
          translated_title,
          text,
          translated_text,
          status_memory: res.status_memory,
          status_runtime: res.status_runtime,
          status_msg: res.status_msg,
        };
        // console.log("Final question to send:");
        // console.log(question);
        getStoredUser().then((user) => {
          if (res.status_msg === "Accepted") {
            // console.log(
            //   "Add question " + question_id + " to set " + difficulty
            // );
            addQuestionToSet(question_id, difficulty).then(() => {
              handleSendQuestionToServer(question, user);
            });
          } else {
            handleSendQuestionToServer(question, user);
          }
        });
      });
    }
  });
};

const handleSendQuestionToServer = (question: Question, user: User) => {
  if (user && user.uuid) {
    // console.log("found user and start sending");
    sendQuestionToServer(question, user)
      .then(() => {
        console.log("sent and set isAllowed to true");
      })
      .catch(() => {
        console.log("failed to send");
      });
  } else {
    console.log("Need to set up User information");

    getStoredOnlyVisitor().then((onlyVisitor) => {
      if (!onlyVisitor) {
        chrome.runtime.openOptionsPage();
      }
    });
  }
};

const handleSubmitBtnHit = (msg: any, sender: any, sendResponse: Function) => {
  if (msg == MessageType.SUBMIT) {
    sendResponse();
  }
};

const getFullDate = (date: Date): string => {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

const checkIfNewDay = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    getDate().then((date: Date) => {
      const newDate = new Date();
      if (getFullDate(date) !== getFullDate(newDate)) {
        setDate(newDate).then(clearTodayPerformance).then(resolve, reject);
      } else {
        resolve();
      }
    });
  });
};

chrome.webRequest.onCompleted.addListener(
  debounce(onCompleteHandlerDebounced, 1000),
  SUBMIT_FILTERS
);
chrome.runtime.onMessage.addListener(handleSubmitBtnHit);

//chrome.runtime.onMessage.addListener(debounce(handleSubmitBtnHit, 3000));
