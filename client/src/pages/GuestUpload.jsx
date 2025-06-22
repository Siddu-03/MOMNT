import { useState } from 'react'
import { useParams } from 'react-router-dom'
import UploadForm from '../components/UploadForm'
import Gallery from '../components/Gallery'
import toast from 'react-hot-toast'

/**
 * Guest Upload Page
 * Allows guests to upload images to an event via unique link/QR
 */
const GuestUpload = () => {
  const { eventId } = useParams()
  const [uploads, setUploads] = useState([])
  const [refresh, setRefresh] = useState(false)

  // Callback for successful upload
  const handleUploadSuccess = (newUpload) => {
    setUploads(prev => [newUpload, ...prev])
    toast.success('Upload successful!')
  }

  // Callback for error
  const handleUploadError = (msg) => {
    toast.error(msg)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="w-full max-w-lg mx-auto card p-8 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Upload Your Moment</h1>
        <p className="text-white/70 mb-6 text-center">Share your favorite photos for this event. JPG/PNG only. Max 5 at a time.</p>
        <UploadForm
          eventId={eventId}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
        />
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <Gallery uploads={uploads} />
      </div>
    </div>
  )
}

export default GuestUpload 