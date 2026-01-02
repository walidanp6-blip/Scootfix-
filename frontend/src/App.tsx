import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ConnectDevice from "./components/Scooter/ConnectDevice";
import FirmwareViewer from "./components/Scooter/FirmwareViewer";
import SpeedHacker from "./components/Scooter/SpeedHacker";
import Header from "./components/UI/Header";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <ConnectDevice />
            </RequireAuth>
          }
        />
        <Route
          path="/firmware"
          element={
            <RequireAuth>
              <FirmwareViewer />
            </RequireAuth>
          }
        />
        <Route
          path="/speed-hacker"
          element={
            <RequireAuth>
              <SpeedHacker />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;