import { fetchRemindersToday, sendQuestionToServer } from "../utils/api";
import { MessageType } from "../utils/messages";
import {
  addQuestionToSet,
  DefaultRemindSettings,
  getStoredRemindSettings,
  getStoredSubmissionIds,
  getStoredUser,
  RemindSettings,
  setStoredRemindSettings,
  setStoredSubmissionIds,
  setStoredUser,
  todayACIncrement,
  todayTotalIncrement,
  User,
} from "../utils/storage";
import {
  LEETFLASH_DASHBOARD,
  Reminder,
  SubmissionDetail,
} from "../utils/types";
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
    if (!user || !user.email) {
      chrome.runtime.openOptionsPage();

      setStoredUser(DefaultUser);
      setStoredRemindSettings(DefaultRemindSettings);
    }
  });

  //Set alarm
  alarmSetter(DefaultRemindSettings);
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  //early return if the alarm has passed
  if (alarm.scheduledTime < Date.now()) return;

  const reminders: Reminder[] = await fetchRemindersToday();
  if (reminders.length > 0) {
    const remindSettings = await getStoredRemindSettings();

    chrome.notifications.create({
      iconUrl: "IconOnly2.png",
      message: `${reminders.length} questions due today, click to open LeetFlash website`,
      contextMessage: "you can also view questions by opening popup!",
      title: "LeetFlash Review Reminder",
      type: "basic",
      requireInteraction: true,
      buttons: [
        {
          title: "Take a look",
        },
        {
          title: `Remind me in ${remindSettings.delayMins} mins`,
        },
      ],
    });
  }
});

chrome.notifications.onButtonClicked.addListener(
  async (id: string, idx: number) => {
    if (idx == 0) {
      chrome.tabs.create({ url: LEETFLASH_DASHBOARD });
    } else if (idx == 1) {
      const remindSettings = await getStoredRemindSettings();

      chrome.alarms.create("delayReminder", {
        delayInMinutes: remindSettings.delayMins,
      });
    }
  }
);

chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({ url: LEETFLASH_DASHBOARD });
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
  console.log("shit");
  console.log(user);

  if (user && user.email) {
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

export const alarmSetter = (remindSettings: RemindSettings) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  chrome.alarms.clearAll(() => {
    remindSettings.timeSlots.forEach((min) => {
      const diff = todayStart.getTime() + min * 60 * 1000 - Date.now();
      chrome.alarms.create(`reminder-${min}`, {
        when: diff,
        periodInMinutes: 24 * 60,
      });
    });
  });
};
