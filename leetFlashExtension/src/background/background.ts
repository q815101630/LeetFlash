import {
  archiveCard,
  fetchRemindersToday,
  sendNoteToServer,
  sendQuestionToServer,
} from "../utils/api";
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
  Card,
  CardInfo,
  LEETFLASH_DASHBOARD,
  Note,
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
  fetchNoteCN,
  fetchNoteEN,
  fetchSubmissionDetailsCN,
  fetchSubmissionDetailsEN,
} from "./background.api";

const SUBMIT_FILTERS = {
  urls: [
    "https://leetcode.com/submissions/detail/*/check/",
    "https://leetcode.cn/submissions/detail/*/check/",
  ],
};

enum NOTIFICATION_ID {
  NEW_QUESTION = "NEW_QUESTION",
  NEW_REVIEW = "NEW_REVIEW",
  DAILY_REVIEW = "DAILY_ALARM",
  ARCHIVED = "ARCHIVED",
}

/**
 * Below are functions
 */

const getCurrentTab = async () => {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
};

const getTitleSlug = (url: string) => {
  const regexp = /^https:\/\/.+\.(com|cn)\/problems\/([a-zA-Z0-9-]+)\/*/;
  const [_ignore, _site, slug] = url.match(regexp);
  return slug;
};

const getSubmissionId = (url: string) => {
  const regexp =
    /^https:\/\/.+\.(com|cn)\/submissions\/detail\/([0-9]+)\/check\//;
  const [_ignore, site, id] = url.match(regexp);
  return { site, id, url };
};

const onCompleteHandlerDebounced = (params: any) => {
  if (
    params.initiator !== "https://leetcode.com" &&
    params.initiator !== "https://leetcode.cn"
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
  if (getSubmissionId(url).site === "cn") {
    submissionDetail = await fetchSubmissionDetailsCN(getSubmissionId(url).id);
  } else {
    const titleSlug = getTitleSlug(await getCurrentTab());
    submissionDetail = await fetchSubmissionDetailsEN(url, titleSlug);
  }
  console.log("background submission detail:");
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
        const { card, info }: { card: Card; info: CardInfo } = await res.json();
        if (info == CardInfo.NEW) {
          chrome.notifications.create(
            `${NOTIFICATION_ID.NEW_QUESTION}-${card._id}-${user._id}`,
            {
              iconUrl: "IconOnly2.png",
              message: `Do you want to archive this question? Archiving it will not show this question in the daily review any more.`,
              title: `Detected New Question \`${card.question.title}\` Submission!`,
              type: "basic",
              requireInteraction: true,
              buttons: [
                {
                  title: "Archive Now",
                },
              ],
            }
          );
        } else if (info == CardInfo.REVIEW) {
          chrome.notifications.create(
            `${NOTIFICATION_ID.NEW_REVIEW}-${card._id}-${user._id}`,
            {
              iconUrl: "IconOnly2.png",
              message: `New review record \`${card.question.title}\` sync success! Achieved stage ${card.stage} of ${card.total_stages.length}`,
              title: "New Review Submission Success",
              type: "basic",
              requireInteraction: true,
              buttons: [
                {
                  title: "Do not want reviewing it anymore. Archive Now",
                },
              ],
            }
          );
        } else if (info == CardInfo.ARCHIVED) {
          chrome.notifications.create({
            iconUrl: "IconOnly2.png",
            message: `\`${card.question.title}\` is archived, No Action Needed`,
            title: "Archived Question",
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

/**
 * A function that check if a new day comes, if comes, then reset performance and submissionIds
 *
 */
const checkIfNewDay = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    getDate().then((date: Date) => {
      const newDate = new Date();
      if (getFullDate(date) !== getFullDate(newDate)) {
        setDate(newDate)
          .then(clearTodayPerformance)
          .then(() => setStoredSubmissionIds([]))
          .then(resolve, reject);
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

    chrome.notifications.create(NOTIFICATION_ID.DAILY_REVIEW, {
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
    if (id === NOTIFICATION_ID.DAILY_REVIEW) {
      if (idx == 0) {
        chrome.tabs.create({ url: LEETFLASH_DASHBOARD });
      } else if (idx == 1) {
        const remindSettings = await getStoredRemindSettings();

        chrome.alarms.create("delayReminder", {
          delayInMinutes: remindSettings.delayMins,
        });
      }
    } else {
      // id === NOTIFICATION_ID.NEW_QUESTION or
      // id === NOTIFICATION_ID.NEW_REVIEW
      // Archive Question
      const [, cardId, userId] = id.split("-");
      archiveCard(cardId, userId)
        .then((card) => {
          console.log(`archived ${card.id}`);
        })
        .catch((err) => {
          console.log(err);
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

/**
 * A WebRequest interceptor that monitor the update of notes for EN site
 */
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method == "POST") {
      const postedBody = JSON.parse(
        decodeURIComponent(
          String.fromCharCode.apply(
            null,
            new Uint8Array(details.requestBody.raw[0].bytes)
          )
        )
      );
      if (
        !!postedBody &&
        !!postedBody.operationName &&
        postedBody.operationName === "updateNote"
      ) {
        const titleSlug = postedBody.variables.titleSlug;
        setTimeout(async () => {
          const note: Note = await fetchNoteEN(titleSlug);

          const user = await getStoredUser();
          if (!user || !user.email) {
            return;
          }

          sendNoteToServer(note, user);
        }, 3000);
      }
    }
  },
  { urls: ["https://leetcode.com/graphql"] },
  ["requestBody"]
);

/**
 * A WebRequest interceptor that monitor the update of notes for CN site
 */
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.method == "POST") {
      const postedBody = JSON.parse(
        decodeURIComponent(
          String.fromCharCode.apply(
            null,
            new Uint8Array(details.requestBody.raw[0].bytes)
          )
        )
      );
      if (
        !!postedBody &&
        !!postedBody.operationName &&
        (postedBody.operationName === "noteCreateCommonNote" ||
          postedBody.operationName === "noteUpdateUserNote")
      ) {
        const titleSlug = postedBody.variables.targetId;
        setTimeout(async () => {
          const note = await fetchNoteCN(titleSlug);

          const user = await getStoredUser();
          if (!user || !user.email) {
            return;
          }

          sendNoteToServer(note, user);
        }, 3000);
      }
    }
  },
  { urls: ["https://leetcode.cn/graphql/"] },
  ["requestBody"]
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
      "https://leetcode.cn/problems/*/submit/",
    ],
  }
);
