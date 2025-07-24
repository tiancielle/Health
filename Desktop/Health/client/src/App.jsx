import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '.
/pages/public/HomePage';

function App() {
  const [count, setCount] = useState(0)

  return (
    
    
      <div className='App'>
        <BrowserRouter>
    <Routes>
          <Route path='/' element={<HomePage/>}/>
          {/* Futures routes .. */}

        </Routes>
    </BrowserRouter> 
        
      </div>
    
  )
}

export default App
