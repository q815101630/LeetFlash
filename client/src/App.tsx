import "./App.css";
import { Container } from "@chakra-ui/react";
import LoginPage from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import { selectUser } from "./redux/user/userSlice";
import { Dashboard } from "./pages/dashboard";

function App() {
  const user = useAppSelector(selectUser);

  return (
    <BrowserRouter>
      <Routes>
        //TODO: Reference the cloth example on how managing routes
        <Route
          path="/login"
          element={user.status === "active" ? <Dashboard /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={user.status === "active" ? <Dashboard /> : <LoginPage />}
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
