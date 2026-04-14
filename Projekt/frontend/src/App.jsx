import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AddPatientPage from "./pages/AddPatientPage";
import EditPatientPage from "./pages/EditPatientPage";
import Profile from "./pages/Profile";
import Patients from "./pages/Patients";
import Charts from "./pages/Charts";
import AirQualityPage from "./pages/AirQualityPage";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-patient"
          element={
            <PrivateRoute>
              <AddPatientPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-patient/:id"
          element={
            <PrivateRoute>
              <EditPatientPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <Patients />
            </PrivateRoute>
          }
        />
        <Route
          path="/charts"
          element={
            <PrivateRoute>
              <Charts />
            </PrivateRoute>
          }
        />
        <Route
          path="/air-quality"
          element={
            <PrivateRoute>
              <AirQualityPage />
            </PrivateRoute>
          }
        />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
