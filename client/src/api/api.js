import axios from 'axios'

/**
 * API Configuration
 * Centralized axios instance for making HTTP requests to the backend
 */
const api = axios.create({
  baseURL: '/api', // Proxy to backend server
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('momnt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('momnt_token')
      window.location.href = '/login'
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
      return Promise.reject({
        message: 'Network error. Please check your connection.'
      })
    }
    
    return Promise.reject(error)
  }
)

export { api } 