window.addEventListener("load", myMain, false);
const SUBMIT_BTN = "[data-cy='submit-code-btn']";
function myMain(evt) {
  var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  function checkForJS_Finish() {
    if (document.querySelector(SUBMIT_BTN)) {
      clearInterval(jsInitChecktimer);
      // DO YOUR STUFF HERE.
      let btn = document.querySelector(SUBMIT_BTN);
      console.log("Listening to submit btn");
      btn.addEventListener("click", function () {
        console.log("sent Submit request from injected");
        window.dispatchEvent(new CustomEvent("submitBtnHit"));
      });
    }
  }
}
