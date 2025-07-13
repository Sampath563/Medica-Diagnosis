import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HealthDiagnosis from './pages/HealthDiagnosis';
import TreatmentPlanner from './pages/TreatmentPlanner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/diagnosis" element={<HealthDiagnosis />} />
        <Route path="/treatment" element={<TreatmentPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;
