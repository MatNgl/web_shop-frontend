import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d’accueil */}
        <Route path="/" element={<HomePage />} />

        {/* Page de connexion */}
        <Route path="/login" element={<LoginPage />} />

        {/* Page d'inscription */}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
