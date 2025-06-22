import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Camera, Menu, X, LogOut, User } from 'lucide-react'

/**
 * Navigation Component
 * Responsive navbar with MOMNT branding and authentication-aware menu
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  // Handle scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-md border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Camera className="h-8 w-8 text-primary-400 group-hover:text-primary-300 transition-colors duration-200" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold gradient-text">MOMNT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'text-primary-400' : 'text-white/70 hover:text-white'}`}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'text-primary-400' : 'text-white/70 hover:text-white'}`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white/70">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn-outline"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/70 hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/5 backdrop-blur-md rounded-lg mt-2 border border-white/10">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? 'text-primary-400 bg-white/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      location.pathname === '/dashboard' 
                        ? 'text-primary-400 bg-white/10' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2 text-white/50 text-sm">
                    {user?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 