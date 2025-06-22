import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import GuestUpload from './pages/GuestUpload'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

/**
 * Main App Component
 * Handles routing and global state management
 */
function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold gradient-text mb-4">MOMNT</div>
          <div className="spinner mx-auto"></div>
          <p className="text-white/70 mt-4">Loading your moments...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Navigation - hidden on guest upload page */}
        <Routes>
          <Route path="/upload/:eventId" element={<GuestUpload />} />
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App 