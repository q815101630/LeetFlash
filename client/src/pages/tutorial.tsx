import { useEffect } from "react";

const TutorialPage = () => {
  // open to google.com with useEffect

  useEffect(() => {
    window.open("https://lucheng.xyz/2022/04/14/leetflash/", "_blank");

    //redirect to targetUrl
    window.location.href = "https://leetflash.com";
  }, []);

  return <div> Tutorial Page </div>;
};

export default TutorialPage;
