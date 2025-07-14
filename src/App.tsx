import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import HealthDiagnosis from './pages/HealthDiagnosis';
import TreatmentPlanner from './pages/TreatmentPlanner';
import Login from './pages/login';
import Register from './pages/register';

const validateToken = (token: string | null) => {
  console.log("Validating token:", token);
  // Add real validation logic here if using JWT or similar
  // For now, accept 'dummy_token' as valid to avoid premature redirect
  if (!token) {
    console.log("Token invalid: null or empty");
    return false;
  }
  return true;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!validateToken(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diagnosis"
        element={
          <ProtectedRoute>
            <HealthDiagnosis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/treatment-planner"
        element={
          <ProtectedRoute>
            <TreatmentPlanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/treatment"
        element={
          <ProtectedRoute>
            <TreatmentPlanner />
          </ProtectedRoute>
        }
      />
      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
