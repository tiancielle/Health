// client/src/App.jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import HomePage from './pages/public/HomePage'
import NotFoundPage from './pages/public/NotFoundPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
// import SearchResults from './pages/patient/SearchResults'
import DoctorProfile from './pages/patient/DoctorProfile'
import AboutPage from './pages/public/AboutPage'
import ForDoctorsPage from './pages/public/ForDoctorsPage'
import ContactPage from './pages/public/ContactPage'


function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path='/' element={<HomePage/>}/>
          <Route path='/about-us' element={<AboutPage />} />
          <Route path='/for-doctors' element={<ForDoctorsPage />} />
          <Route path='/contact' element={<ContactPage />} />
          
          {/* Routes d'authentification */}
          <Route path='/auth/Login' element={<LoginPage/>} />        
          <Route path='/auth' element={<LoginPage/>} />
          <Route path='/auth/Register' element={<RegisterPage />}/>
          
          {/* Routes de recherche et médecins */}
          {/* <Route path='/search' element={<SearchResults />} /> */}
          <Route path='/doctor/:id' element={<DoctorProfile />} />
          
          {/* Futures routes patients */}
          {/* <Route path='/patient/dashboard' element={<PatientDashboard />} /> */}
          {/* <Route path='/patient/appointments' element={<MyAppointments />} /> */}
          {/* <Route path='/patient/profile' element={<PatientProfile />} /> */}
          {/* <Route path='/book-appointment/:doctorId' element={<BookAppointment />} /> */}
          
          {/* Futures routes médecins */}
          {/* <Route path='/doctor/dashboard' element={<DoctorDashboard />} /> */}
          {/* <Route path='/doctor/schedule' element={<ManageSchedule />} /> */}
          {/* <Route path='/doctor/patients' element={<PatientsList />} /> */}
          
          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter> 
    </div>
  )
}

export default App