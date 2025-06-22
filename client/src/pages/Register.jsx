import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'

/**
 * Register Page Component
 * Allows new hosts to sign up securely
 */
const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    const result = await register(email, password)
    setLoading(false)
    if (result.success) {
      toast.success('Account created!')
      navigate('/dashboard')
    } else {
      setError(result.error)
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="card w-full max-w-md mx-auto p-8">
        <div className="flex items-center justify-center mb-6">
          <UserPlus className="h-8 w-8 text-primary-400 mr-2" />
          <h2 className="text-2xl font-bold text-white">Host Sign Up</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white/80 mb-1">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white/80 mb-1">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-white/80 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <span className="spinner mr-2"></span> : null}
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center text-white/60 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register 