import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/public/HomePage'
import NotFoundPage from './pages/public/NotFoundPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    
    
      <div className='App'>
        <BrowserRouter>
    <Routes>
          <Route path='/' element={<HomePage/>}/>  
          <Route path='/auth/Login' element={<LoginPage/>} />        
          <Route path='/auth' element={<LoginPage/>} />
          <Route path='/auth/Register' element={<RegisterPage />}/>
          {/* Futures routes .. */}
          
          <Route path="*" element={<NotFoundPage />} /> {/*  Route 404 */}
        </Routes>
    </BrowserRouter> 
        
      </div>
    
  )
}

export default App
