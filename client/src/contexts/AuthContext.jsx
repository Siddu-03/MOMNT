import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/api'

/**
 * Authentication Context
 * Manages user authentication state, login/logout, and token storage
 */
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('momnt_token'))

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Verify token and get user data
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data.user)
        } catch (error) {
          console.error('Token validation failed:', error)
          // Clear invalid token
          localStorage.removeItem('momnt_token')
          setToken(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [token])

  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login response
   */
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data
      
      // Store token and update state
      localStorage.setItem('momnt_token', newToken)
      setToken(newToken)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  /**
   * Register new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Registration response
   */
  const register = async (email, password) => {
    try {
      const response = await api.post('/auth/signup', { email, password })
      const { token: newToken, user: userData } = response.data
      
      // Store token and update state
      localStorage.setItem('momnt_token', newToken)
      setToken(newToken)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  /**
   * Logout user and clear all auth data
   */
  const logout = () => {
    localStorage.removeItem('momnt_token')
    setToken(null)
    setUser(null)
  }

  /**
   * Update user data (for profile updates, etc.)
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(userData)
  }

  // Context value
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 