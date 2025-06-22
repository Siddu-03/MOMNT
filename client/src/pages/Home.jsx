import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Camera, QrCode, Shield, Smartphone, ArrowRight, Play, Sparkles } from 'lucide-react'

/**
 * Home Page Component
 * Landing page with hero section, features, and call-to-action
 */
const Home = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { isAuthenticated } = useAuth()

  // Animate elements on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Sparkles className="h-4 w-4 text-primary-400 mr-2" />
              <span className="text-sm font-medium text-white/90">Privacy-First Photo Collection</span>
            </div>

            {/* Main Title */}
            <h1 className={`text-responsive-xl font-bold mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="block text-white">Moments.</span>
              <span className="block gradient-text">Collected.</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl text-white/70 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Create unforgettable events where guests can share photos privately. 
              Scan, upload, and let the host curate the perfect collection of memories.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary inline-flex items-center">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <Link to="/register" className="btn-primary inline-flex items-center">
                  <span>Create an Event</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
              <button className="btn-outline inline-flex items-center">
                <Play className="mr-2 h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">100%</div>
                <div className="text-white/70">Private</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">0</div>
                <div className="text-white/70">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">∞</div>
                <div className="text-white/70">Memories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold text-white mb-4">Why Choose MOMNT?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Simple, secure, and beautifully designed for modern events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">QR Code Magic</h3>
              <p className="text-white/70">
                One scan, instant access. No downloads, no registrations for guests.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Privacy First</h3>
              <p className="text-white/70">
                Guests upload but can't view. Complete privacy until you're ready to share.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Web-Based</h3>
              <p className="text-white/70">
                Works on any device with a browser. No app downloads required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Three simple steps to collect unforgettable moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create Your Event</h3>
              <p className="text-white/70">
                Register and set up your event in seconds with a simple form.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Share QR Code</h3>
              <p className="text-white/70">
                Display the generated QR code for guests to scan and upload photos.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Collect Memories</h3>
              <p className="text-white/70">
                View and curate all uploaded photos in your private dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="card">
            <h2 className="text-responsive-lg font-bold text-white mb-4">
              Ready to Start Collecting Moments?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of hosts who trust MOMNT for their special events.
            </p>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary inline-flex items-center">
                <span>Go to Dashboard</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <Link to="/register" className="btn-primary inline-flex items-center">
                <span>Get Started Free</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 