/**
 * code in inject.js
 * added "web_accessible_resources": ["injected.js"] to manifest.json
 */

var s = document.createElement("script");
var ss = document.createElement("script");
s.type = "module";
s.src = chrome.runtime.getURL("injected.js");
ss.type = "module";
ss.src = chrome.runtime.getURL("submitBtnInjectEN.js");

s.onload = function () {
  this.remove();
};
ss.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
(document.head || document.documentElement).appendChild(ss);

console.log("LeetFlash extension loaded");
