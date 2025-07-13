import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HealthDiagnosis from './pages/HealthDiagnosis';
import TreatmentPlanner from './pages/TreatmentPlanner';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/diagnosis" element={<HealthDiagnosis />} />
      <Route path="/treatment-planner" element={<TreatmentPlanner />} />
      <Route path="/treatment" element={<TreatmentPlanner />} />
    </Routes>
  );
}

export default App;
