import { SubmissionDetail } from "../utils/types";

const QUERY_STRING = `
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

export const fetchSubmissionDetails = async ({
  site,
  id,
}: {
  site: string;
  id: string;
}): Promise<SubmissionDetail> => {
  const url =
    site === "leetcode"
      ? `https://leetcode.com/graphql/`
      : `https://leetcode-cn.com/graphql/`;

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY_STRING,
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
          reject("no data");
        }
      })
      .catch((err) => reject(err));
  });
};
