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

// XHR.send = function () {
//   this.addEventListener("load", function () {
//     const url = this.responseURL;
//     const responseHeaders = this.getAllResponseHeaders();
//     console.log(url);
//     try {
//       if (this.responseType === "blob") {
//         // GraphQL data is returned as a blob
//         this.response.text().then((data) => {
//           if (typeof data === "string") {
//             console.log(data);
//             // const parsedData = JSON.parse(data);
//             // if (parsedData.data && "question" in parsedData.data) {
//             //   console.log(parsedData.data.question);
//             // }
//           }
//         });
//       } else if (
//         /^https:\/\/(leetcode-cn.com|leetcode.com)\/submissions\/detail\/.*\/check\/$/.test(
//           url
//         )
//       ) {
//         let responseBody;
//         if (this.responseType === "" || this.responseType === "text") {
//           responseBody = JSON.parse(this.responseText);
//         } /* if (this.responseType === 'json') */ else {
//           responseBody = this.response;
//         }
//         console.log(url);
//         console.log(responseHeaders);
//         console.log(responseBody);
//       }
//     } catch (err) {
//       console.debug("Error reading or processing response.", err);
//     }
//   });

//   return send.apply(this, arguments);
// };
