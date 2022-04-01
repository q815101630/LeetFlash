import { sendQuestionToServer } from "../utils/api";
import { MessageType } from "../utils/messages";
import {
  addQuestionToSet,
  getStoredSubmissionIds,
  getStoredUser,
  setStoredSubmissionIds,
  setStoredUser,
  todayACIncrement,
  todayTotalIncrement,
  User,
} from "../utils/storage";
import { SubmissionDetail } from "../utils/types";
import {
  clearTodayPerformance,
  DefaultUser,
  getDate,
  getStoredOnlyVisitor,
  setDate,
} from "./../utils/storage";
import { fetchSubmissionDetails } from "./background.api";

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
  //setStoredQuestionInfo([]);
});

const getSubmissionId = (url: string) => {
  const regexp = /^https:\/\/(.+)\.com\/submissions\/detail\/([0-9]+)\/check\//;
  const [_ignore, site, id] = url.match(regexp);
  return { site, id };
};

const onCompleteHandlerDebounced = (params: any) => {
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
  const submissionDetail = await fetchSubmissionDetails(getSubmissionId(url));
  console.log(submissionDetail);

  // push to submission ids if not found yet, increment total ,ac for today
  const submissionIds = await getStoredSubmissionIds();
  console.log(`submissions: ${submissionIds}`);
  console.log(`current submission: ${submissionDetail.id}`);

  // only start processing after receive a valid status && not in submission ids
  if (
    submissionDetail.id &&
    !submissionIds.includes(submissionDetail.id) &&
    submissionDetail.statusDisplay !== ""
  ) {
    submissionIds.push(submissionDetail.id);
    await setStoredSubmissionIds(submissionIds);
    await todayTotalIncrement();

    if (submissionDetail.statusDisplay === "Accepted") {
      await todayACIncrement();

      await addQuestionToSet(
        submissionDetail.question.questionId,
        submissionDetail.question.difficulty
      );
      const user = await getStoredUser();
      console.log(user);
      handleSendQuestionToServer(submissionDetail, user);
    }
  }
};

const handleSendQuestionToServer = (
  submissionDetail: SubmissionDetail,
  user: User
) => {
  if (user && user.uuid) {
    console.log("found user and start sending");
    sendQuestionToServer(submissionDetail, user)
      .then(() => {
        console.log("sent to server!");
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
  onCompleteHandlerDebounced,
  SUBMIT_FILTERS
);
chrome.runtime.onMessage.addListener(handleSubmitBtnHit);

//chrome.runtime.onMessage.addListener(debounce(handleSubmitBtnHit, 3000));
