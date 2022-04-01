import { useToast } from "@chakra-ui/react";
import { patchCard } from "apis/data.api";
import { createSocket } from "apis/ws.api";
import PopupModal from "components/PopupModal";
import { Card } from "interfaces/interfaces";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { selectSettings, setSocket } from "redux/settings/settingsSlice";
import { checkProfileAsync } from "redux/user/userSlice";
import io from "socket.io-client";
import { formatDate } from "utils";
import "./App.css";
import AboutPage from "./pages/about";
import { Callback } from "./pages/callback";
import DailyReview from "./pages/dailyReview";
import { Dashboard } from "./pages/dashboard";
import LandingPage from "./pages/landingPage";
import LoginPage from "./pages/login";
import { Logout } from "./pages/logout";
import { Setting } from "./pages/setting";

function App() {
  const { socket } = useAppSelector(selectSettings);
  const toast = useToast();
  const { lang } = useAppSelector(selectSettings);
  const [popupCards, setPopupCards] = useState<Card[]>([]);
  const [earlyReviewCards, setEarlyReviewCards] = useState<Card[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = createSocket();
    setSocket(socket);

    const todayReviewListener = (card: Card) => {
      console.log("listened today review!");
      setPopupCards((popupCards) => [...popupCards, card]);
    };

    const earlyReviewListener = (card: Card) => {
      console.log("listened early review!");
      setEarlyReviewCards((earlyReviewCards) => [...earlyReviewCards, card]);
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
  }, [socket]);

  useEffect(() => {
    dispatch(checkProfileAsync());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/review" element={<DailyReview />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="*" element={<LandingPage />} />
      </Routes>
      {earlyReviewCards.map((card, i) => (
        <PopupModal
          key={`${card._id}-${i}`}
          card={card}
          text={`It seems you early reviewed \`${
            lang === "EN" ? card.question.title : card.question.translatedTitle
          }\`, good job! When do you prefer to review for the next time? 🐼`}
          header={`Keep it up! 💯`}
          btn1Text={`Go to next stage`}
          btn2Text={`Default: ${formatDate(card.next_rep_date)}`}
          btn1Handler={() => {
            card.last_rep_date = new Date();
            card.next_rep_date = new Date(
              new Date().getTime() + card.total_stages[card.stage++] * 86400000
            );
            patchCard(card);
          }}
          removePopup={() => setEarlyReviewCards((cards) => cards.slice(0, -1))}
        />
      ))}

      {popupCards.map((card, i) => {
        const isToday =
          formatDate(card.next_rep_date) === formatDate(new Date());
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return (
          <PopupModal
            text={`You reviewed \`${
              lang === "EN"
                ? card.question.title
                : card.question.translatedTitle
            }\`, due \`${
              isToday ? "Today" : formatDate(card.next_rep_date)
            }\`. When do you prefer to review for the next time? 🐼`}
            header={`Reviewed a problem 😎`}
            btn1Text={`Not sure? Tomorrow!`}
            btn2Text={`${
              new Date(card.next_rep_date).getTime() < today.getTime()
                ? "Oops, late! Three days later 😒"
                : formatDate(new Date(today.getTime() + 3 * 86400000))
            }`}
            btn1Handler={() => {
              card.last_rep_date = new Date();
              card.next_rep_date = new Date(Date.now() + 24 * 60 * 60 * 1000);
              // does not modify stage
              patchCard(card);
            }}
            btn2Handler={() => {
              card.last_rep_date = new Date();
              card.next_rep_date = new Date(today.getTime() + 3 * 86400000);
              // does not modify stage
              patchCard(card);
            }}
            key={`${card._id}-${i}`}
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
