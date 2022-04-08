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
import {
  alarmSetter,
  fetchSubmissionDetailsCN,
  fetchSubmissionDetailsEN,
} from "./background.api";

const SUBMIT_FILTERS = {
  urls: [
    "https://leetcode.com/submissions/detail/*/check/",
    "https://leetcode-cn.com/submissions/detail/*/check/",
  ],
};

/**
 * Below are functions
 */

const getCurrentTab = async () => {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
};

const getTitleSlug = (url: string) => {
  const regexp = /^https:\/\/(.+)\.com\/problems\/([a-zA-Z0-9-]+)\/*/;
  const [_ignore, _site, slug] = url.match(regexp);
  return slug;
};

const getSubmissionId = (url: string) => {
  const regexp = /^https:\/\/(.+)\.com\/submissions\/detail\/([0-9]+)\/check\//;
  const [_ignore, site, id] = url.match(regexp);
  return { site, id, url };
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
  let submissionDetail: SubmissionDetail;
  if (getSubmissionId(url).site === "leetcode-cn") {
    submissionDetail = await fetchSubmissionDetailsCN(getSubmissionId(url).id);
  } else {
    const titleSlug = getTitleSlug(await getCurrentTab());
    submissionDetail = await fetchSubmissionDetailsEN(url, titleSlug);
  }
  console.log("Here");
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
      await addQuestionToSet(
        submissionDetail.question.questionId,
        submissionDetail.question.difficulty,
        submissionDetail.runtime
      );
      await todayACIncrement();

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
  if (user && user.email) {
    console.log("found user and start sending");
    sendQuestionToServer(submissionDetail, user)
      .then(async (res: Response) => {
        const card: any = await res.json();
        if (res.status == 201) {
          chrome.notifications.create({
            iconUrl: "IconOnly2.png",
            message: `New question \`${card.question.title}\` sync success!`,
            title: "New Question Submission Success",
            type: "basic",
          });
        } else {
          chrome.notifications.create({
            iconUrl: "IconOnly2.png",
            message: `New review record \`${card.question.title}\` sync success!`,
            title: "New Review Submission Success",
            type: "basic",
          });
        }
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

// const handleSubmitBtnHit = (msg: any, sender: any, sendResponse: Function) => {
//   if (msg == MessageType.SUBMIT) {
//     sendResponse();
//   }
// };

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

//chrome.runtime.onMessage.addListener(debounce(handleSubmitBtnHit, 3000));

/**
 * Below are listeners
 */
chrome.runtime.onInstalled.addListener(() => {
  getStoredUser().then((user) => {
    if (!user || !user.email) {
      chrome.runtime.openOptionsPage();

      setStoredUser(DefaultUser);
      setStoredRemindSettings(DefaultRemindSettings);
      setStoredRemindSettings(DefaultRemindSettings).then(() =>
        chrome.alarms.clearAll(() => {
          getStoredRemindSettings().then((remindSettings) => {
            alarmSetter(DefaultRemindSettings);
          });
        })
      );
    }
  });
});

console.log("registered");
chrome.alarms.onAlarm.addListener(async (alarm) => {
  //early return if the alarm has passed

  if (alarm.scheduledTime < Date.now() - 5 * 1000) return;
  const reminders: Reminder[] = await fetchRemindersToday();
  if (reminders.length > 0) {
    const remindSettings = await getStoredRemindSettings();

    chrome.notifications.create({
      iconUrl: "IconOnly2.png",
      message: `${reminders.length} questions due today`,
      contextMessage: "Click to open LeetFlash web!",
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

chrome.webRequest.onCompleted.addListener(
  onCompleteHandlerDebounced,
  SUBMIT_FILTERS
);

// chrome.runtime.onMessage.addListener(handleSubmitBtnHit);

/**
 * Following are workaround for problem that service worker does not wake after
 * after a long period of inactive in M3
 * https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
 */

// Level 1: Redirect and make sure the service worker is awake
chrome.webNavigation.onBeforeNavigate.addListener(
  ({ url }) => {
    console.log("AWAKE: urlContains redirecting to " + url);
  },
  { url: [{ urlContains: "leetcode" }] }
);

// Level 2: When submitting the question, make sure the service worker is awake
chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ url }) => {
    console.log("AWAKE: BeforeSendHeaders " + url);
  },
  {
    urls: [
      "https://leetcode.com/problems/*/submit/",
      "https://leetcode-cn.com/problems/*/submit/",
    ],
  }
);
