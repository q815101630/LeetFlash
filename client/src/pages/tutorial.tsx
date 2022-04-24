import { useEffect } from "react";

const TutorialPage = () => {
  // open to google.com with useEffect

  useEffect(() => {
    window.open("https://lucheng.xyz/2022/04/14/leetflash/", "_blank");

    //redirect to previous url
    window.history.back();
  }, []);

  return <div> Tutorial Page </div>;
};

export default TutorialPage;
