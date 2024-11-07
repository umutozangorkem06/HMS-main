import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";

import Admin from "./components/Admin/Admin";

import PatientMain from "./components/Patient/PatientMain";
import PharmacistMain from "./components/Pharmacist/PharmacistMain";
import DoctorMain from "./components/Doctor/DoctorMain";

import Navbar from "./components/Navbar";

const App = () => {
  const [authToken, setAuthToken] = useState();
  const navigate = useNavigate();

  const getAuthTokenFromLocalStorage = () => {
    return localStorage.getItem("authToken");
  };
  useEffect(() => {
    const checkAuthTokenBeforeUnload = (event) => {
      const token = getAuthTokenFromLocalStorage();
      if (!token) {
        event.preventDefault();
        // Prompt the user to stay on the page
        event.returnValue = "";
        // Navigate to login page
        navigate("/login");
      }
    };
    window.addEventListener("beforeunload", checkAuthTokenBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", checkAuthTokenBeforeUnload);
    };
  }, [authToken]);

  return (
    <>
      <Navbar authToken={authToken} setAuthToken={setAuthToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="login"
          element={<Login authToken={authToken} setAuthToken={setAuthToken} />}
        />
        <Route
          path="register"
          element={
            <Register authToken={authToken} setAuthToken={setAuthToken} />
          }
        />
        <Route path="patient-main" element={<PatientMain />} />
        <Route path="doctor-main" element={<DoctorMain />} />
        <Route path="pharmacist-main" element={<PharmacistMain />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </>
  );
};

export default App;
