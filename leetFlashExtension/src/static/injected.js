// //https://stackoverflow.com/questions/6831916/is-it-possible-to-monitor-http-traffic-in-chrome-using-an-extension/67390377#67390377

// const XHR = XMLHttpRequest.prototype;

// const open = XHR.open;
// const send = XHR.send;
// const setRequestHeader = XHR.setRequestHeader;

// XHR.open = function () {
//   this._requestHeaders = {};

//   return open.apply(this, arguments);
// };

// XHR.setRequestHeader = function (header, value) {
//   this._requestHeaders[header] = value;
//   return setRequestHeader.apply(this, arguments);
// };

// function convertToPlain(html) {
//   // Create a new div element
//   var tempDivElement = document.createElement("div");

//   // Set the HTML content with the given value
//   tempDivElement.innerHTML = html;

//   // Retrieve the text property of the element
//   return tempDivElement.textContent || tempDivElement.innerText || "";
// }

// XHR.send = function () {
//   this.addEventListener("load", function () {
//     const url = this.responseURL;
//     const responseHeaders = this.getAllResponseHeaders();
//     try {
//       if (this.responseType === "blob") {
//         // GraphQL data is returned as a blob
//         this.response.text().then((data) => {
//           if (typeof data === "string") {
//             if (data) {
//               const parsedData = JSON.parse(data);
//               // execute when recieve questionData from GraphQL
//               if (
//                 parsedData.data &&
//                 "question" in parsedData.data &&
//                 !parsedData.data.question.nextChallengePairs
//               ) {
//                 const question_id = parsedData.data.question.questionId;
//                 const title = parsedData.data.question.title;
//                 const text = convertToPlain(
//                   parsedData.data.question.content
//                 ).replace(/\n/g, " ");
//                 const id = parsedData.data.question.questionFrontendId;
//                 const difficulty =
//                   parsedData.data.question.difficulty?.toLowerCase();

//                 const questionInfo = {
//                   question_id,
//                   title,
//                   text,
//                   id,
//                   difficulty,
//                 };

//                 window.dispatchEvent(
//                   new CustomEvent("getQuestionInfoFromEN", {
//                     detail: questionInfo,
//                   })
//                 );
//               }
//             }
//           }
//         });
//       }
//     } catch (err) {
//       console.debug("Error reading or processing response.", err);
//     }
//   });

//   return send.apply(this, arguments);
// };
