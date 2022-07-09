import { RemindSettings } from "../utils/storage";
import { Note, SubmissionDetail, SubmissionQuestion } from "../utils/types";

const QUERY_STRING_CN = `
query mySubmissionDetail($id: ID!) {
    submissionDetail(submissionId: $id) {
    id
    code
    runtime
    memory
    rawMemory
    statusDisplay
    timestamp
    lang
    passedTestCaseCnt
    totalTestCaseCnt
    sourceUrl
    question {
        questionId        
        title
        translatedTitle
        titleSlug
        topicTags {
            name
            translatedName
        }
        difficulty
        content
        translatedContent
        __typename
    }
    ... on GeneralSubmissionNode {
        outputDetail {
        codeOutput
        expectedOutput
        input
        compileError
        runtimeError
        lastTestcase
        __typename
        }
        __typename
    }
    submissionComment {
        comment
        flagType
        __typename
    }
    __typename
    }
}
`;
const QUERY_RECENT_SUBMISSION_EN = `
query recentAcSubmissions($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    id
    runtime
    memory
    statusDisplay
    timestamp
    lang
  }
}
`;

const QUERY_QUESTION_EN = `query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    questionFrontendId
    title
    titleSlug
    content
    translatedTitle
    translatedContent
    difficulty
    topicTags {
      name
      slug
      translatedName
      __typename
    }
    __typename
  }
}
`;

const QUERY_NOTE_EN = `
query QuestionNote($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    note
    __typename
  }
}
`;

const QUERY_NOTE_CN = `
query noteOneTargetCommonNote($noteType: NoteCommonTypeEnum!, $targetId: String!, $limit: Int = 10, $skip: Int = 0) {
  noteOneTargetCommonNote(noteType: $noteType, targetId: $targetId, limit: $limit, skip: $skip) {
    count
    userNotes {
      config
      content
      id
      noteType
      status
      summary
      targetId
      updatedAt
      __typename
    }
    __typename
  }
}
`;

/** Process to get the submission detail for US site
 *  Get the title-slug from 2.a
 *  Fetch question
 *  Combine info
 */

export const fetchSubmissionDetailsEN = (
  url: string,
  titleSlug: string
): Promise<SubmissionDetail> => {
  return new Promise((resolve, reject) => {
    const fetchDetail = () => {
      fetch(url, {
        method: "GET",
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res) {
            if (res.state !== "SUCCESS") {
              setTimeout(fetchDetail, 2000);
              return;
            }
            const submissionDetail = {
              id: res.submission_id,
              lang: res.lang,
              runtime: res.status_runtime,
              timestamp: res.task_finish_time,
              statusDisplay: res.status_msg,
              rawMemory: res.status_memory,
              question: null,
              sourceUrl: null,
            };
            const question = await fetchQuestionEN(titleSlug);

            submissionDetail.question = question;
            submissionDetail.sourceUrl = `/problems/${question.titleSlug}/`;

            resolve(submissionDetail as SubmissionDetail);
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    };

    setTimeout(fetchDetail, 2000);
  });
};

export const fetchQuestionEN = (titleSlug: string): Promise<any> => {
  const queryUrl = `https://leetcode.com/graphql/`;

  return new Promise((resolve, reject) => {
    fetch(queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY_QUESTION_EN,
        variables: {
          titleSlug: titleSlug,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          resolve(res.data.question);
        } else {
          reject(res);
        }
      })
      .catch((err) => reject(err));
  });
};

export const fetchNoteEN = (titleSlug: string): Promise<Note> => {
  const queryUrl = `https://leetcode.com/graphql/`;

  return new Promise((resolve, reject) => {
    fetch(queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY_NOTE_EN,
        variables: {
          titleSlug: titleSlug,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          resolve(res.data.question);
        } else {
          reject(res);
        }
      })
      .catch((err) => reject(err));
  });
};

export const fetchNoteCN = (titleSlug: string): Promise<Note> => {
  const queryUrl = `https://leetcode.cn/graphql/`;

  return new Promise((resolve, reject) => {
    fetch(queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY_NOTE_CN,
        variables: {
          limit: 1,
          skip: 0,
          targetId: titleSlug,
          noteType: "COMMON_QUESTION",
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.noteOneTargetCommonNote.userNotes.length > 0) {
          const rawData = res.data.noteOneTargetCommonNote.userNotes[0];

          resolve({ note: rawData.content, questionId: rawData.targetId });
        } else {
          reject(res);
        }
      })
      .catch((err) => reject(err));
  });
};

export const fetchSubmissionDetailsCN = (
  id: string
): Promise<SubmissionDetail> => {
  const queryUrl = `https://leetcode.cn/graphql/`;

  return new Promise((resolve, reject) => {
    fetch(queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY_STRING_CN,
        variables: {
          id: id.toString(),
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          resolve(res.data.submissionDetail);
        } else {
          reject(res);
        }
      })
      .catch((err) => reject(err));
  });
};

export const alarmSetter = (remindSettings: RemindSettings) => {
  console.log("setting!");
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  chrome.alarms.clearAll(() => {
    remindSettings.timeSlots.forEach((min) => {
      const time = todayStart.getTime() + min * 60 * 1000;
      chrome.alarms.create(`reminder - ${min / 60}`, {
        when: time,
        periodInMinutes: 24 * 60,
      });
    });
    chrome.alarms.getAll((alarms) => {
      alarms.forEach((alarm) => {
        console.log(`Set ${alarm.name} at ${alarm.scheduledTime}`);
      });
    });
  });
};

