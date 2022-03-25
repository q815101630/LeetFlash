import "./App.css";
import LoginPage from "./pages/login";
import LandingPage from "./pages/landingPage";
import DailyReview from "./pages/dailyReview";
import AboutPage from "./pages/about";
import { Route, Routes } from "react-router-dom";
import { Callback } from "./pages/callback";
import { Dashboard } from "./pages/dashboard";
import { Logout } from "./pages/logout";
import { Setting } from "./pages/setting";
function App() {
  return (
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
  );
}

export default App;
