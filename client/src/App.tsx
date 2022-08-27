import { Box, useColorModeValue, useToast } from "@chakra-ui/react";
import { moveNextStageCard, patchCard } from "apis/data.api";
import { createSocket } from "apis/ws.api";
import PopupModal from "components/PopupModal";
import { Card } from "interfaces/interfaces";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { selectSettings } from "redux/settings/settingsSlice";
import { checkProfileAsync, selectUser } from "redux/user/userSlice";
import io from "socket.io-client";
import { formatDate } from "utils";
import TutorialPage from "./pages/tutorial";
import { Callback } from "./pages/callback";
import DailyReview from "./pages/dailyReview";
import { Dashboard } from "./pages/dashboard";
import LandingPage from "./pages/landingPage";
import LoginPage from "./pages/login";
import { Logout } from "./pages/logout";
import ResetPassword  from "./pages/resetpassword";

import { Setting } from "./pages/setting";
import Header from "./components/Header";

export const socket = createSocket();

function App() {
  const user = useAppSelector(selectUser);

  const toast = useToast();
  const { lang } = useAppSelector(selectSettings);
  const [popupCards, setPopupCards] = useState<Card[]>([]);
  const [earlyReviewCards, setEarlyReviewCards] = useState<Card[]>([]);
  const dispatch = useAppDispatch();

  const bg = useColorModeValue("gray.100", "gray.800");

  useEffect(() => {
    const todayReviewListener = (card: Card) => {
      console.log("listened today review!");
      // setPopupCards((popupCards) => [...popupCards, card]);
    };

    const earlyReviewListener = (card: Card) => {
      console.log("listened early review!");
      // setEarlyReviewCards((earlyReviewCards) => [...earlyReviewCards, card]);
    };

    const newCardListener = (card: Card) => {
      toast({
        title: "Added New Question! 😊",
        description: `\`${
          card.question.title
        }\` has been added to your list. next review date: ${formatDate(
          card.next_rep_date
        )}.`,
        status: "success",
        duration: 9000,
        position: "top",
        isClosable: true,
      });
      console.log("listened new-card!");
    };

    socket.on("review-today", todayReviewListener);
    socket.on("new-card", newCardListener);
    socket.on("early-review", earlyReviewListener);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    dispatch(checkProfileAsync());
  }, [dispatch]);

  return (
    <>
      <Box bg={bg} minH="100vh">
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/setting" element={<Setting />} /> */}
          <Route path="/review" element={<DailyReview />} />
          <Route path="/tutorial" element={<TutorialPage />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Box>
      {earlyReviewCards.map((card, i) => (
        <PopupModal
          key={`${card.id}-${i}`}
          card={card}
          text={`It seems you early reviewed \`${
            lang === "EN" ? card.question.title : card.question.translatedTitle
          }\`, good job! When do you prefer to review for the next time? 🐼`}
          header={`Keep it up! 💯`}
          btn1Text={`Go to next stage`}
          btn2Text={`No change`}
          btn1Handler={() => {
            //@ts-ignore
            card.id = card._id;
            moveNextStageCard(card);
          }}
          removePopup={() => setEarlyReviewCards((cards) => cards.slice(0, -1))}
        />
      ))}

      {popupCards.map((card, i) => {
        const today = new Date();

        return (
          <PopupModal
            header={`Reviewed a problem 😎`}
            text={`You reviewed \`${
              lang === "EN"
                ? card.question.title
                : card.question.translatedTitle
            }\`, due \`${formatDate(
              card.next_rep_date
            )}\`. When do you prefer to review for the next time? 🐼`}
            btn1Text={`Not sure? Tomorrow!`}
            btn2Text={`${formatDate(new Date(today.getTime() + 3 * 86400000))}`}
            btn1Handler={() => {
              card.last_rep_date = new Date();
              card.next_rep_date = new Date(Date.now() + 24 * 60 * 60 * 1000);
              //@ts-ignore
              card.id = card._id;
              // does not modify stage
              patchCard(card);
            }}
            btn2Handler={() => {
              //@ts-ignore
              card.id = card._id;
              moveNextStageCard(card);
            }}
            key={`${card.id}-${i}`}
            card={card}
            removePopup={() =>
              setPopupCards((popupCards) => popupCards.slice(0, -1))
            }
          />
        );
      })}
    </>
  );
}

export default App;
