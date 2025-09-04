// client/src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ForDoctorsPage from './pages/public/ForDoctorsPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Patient Pages
import DoctorProfile from './pages/patient/DoctorProfile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/for-doctors" element={<ForDoctorsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />

          {/* ==================== AUTHENTICATION ROUTES ==================== */}
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/Login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/Register" element={<Navigate to="/auth/register" replace />} />

          {/* ==================== CATCH-ALL ROUTE ==================== */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;