import "./App.css";
import LoginPage from "./pages/login";
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
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  );
}

export default App;
