// client/src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import PatientProfile from './pages/patient/PatientProfile';
import PatientDashboardPage from './pages/patient/PatientDashboardPage';
import AppointmentsPage from './pages/patient/AppointmentsPage';
import MedicalRecordsPage from './pages/patient/MedicalRecordsPage';
import MessagesPage from './pages/patient/MessagesPage';
import MedicalRecordDetail from './pages/patient/MedicalRecordDetail';

function App() {
  return (
    <div className="App">
      <AuthProvider>
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

            {/* ==================== PATIENT ROUTES ==================== */}
            <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/appointments" element={<AppointmentsPage />} />
            <Route path="/patient/records" element={<MedicalRecordsPage />} />
            <Route path="/patient/messages" element={<MessagesPage />} />
            <Route path="/patient/records/:id" element={<MedicalRecordDetail />} />

            {/* ==================== CATCH-ALL ROUTE ==================== */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;