import { createSocket } from "apis/ws.api";
import PopupModal from "components/PopupModal";
import { Card } from "interfaces/interfaces";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "redux/hooks";
import { selectSettings, setSocket } from "redux/settings/settingsSlice";
import io from "socket.io-client";
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

  const [popupCards, setPopupCards] = useState<Card[]>([]);

  useEffect(() => {
    const socket = createSocket();
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  interface OpenPopupMessage {
    card: Card;
  }

  useEffect(() => {
    if (!socket) return;

    const openPopupListener = ({ card }: OpenPopupMessage) => {
      setPopupCards([...popupCards, card]);
    };

    socket.on("openPopup", openPopupListener);

    return () => {
      socket.off("openPopup", openPopupListener);
    };
  }, [socket, popupCards]);
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

      {popupCards.map((card) => (
        <PopupModal
          key={card.id}
          card={card}
          removePopup={() => setPopupCards(popupCards.slice(0, -1))}
        />
      ))}
    </>
  );
}

export default App;
