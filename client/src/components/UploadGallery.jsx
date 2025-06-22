import { useState } from 'react'
import { Image as ImageIcon, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * UploadGallery Component
 * Displays a responsive grid of uploaded images with lightbox view
 * @param {Array} uploads - Array of upload objects { fileUrl, uploadedAt }
 * @param {boolean} loading - Whether uploads are loading
 */
const UploadGallery = ({ uploads = [], loading }) => {
  const [lightboxIdx, setLightboxIdx] = useState(null)

  // Open lightbox at index
  const openLightbox = idx => setLightboxIdx(idx)
  // Close lightbox
  const closeLightbox = () => setLightboxIdx(null)
  // Navigate lightbox
  const prev = () => setLightboxIdx(i => (i > 0 ? i - 1 : uploads.length - 1))
  const next = () => setLightboxIdx(i => (i < uploads.length - 1 ? i + 1 : 0))

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary-400" /></div>
  }
  if (!uploads.length) {
    return <div className="text-white/60 text-center py-8">No uploads yet.</div>
  }
  return (
    <div>
      <div className="gallery-grid">
        {uploads.map((upload, idx) => (
          <div
            key={upload._id || idx}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-white/5 hover:scale-105 transition-transform duration-200"
            onClick={() => openLightbox(idx)}
          >
            <img
              src={upload.fileUrl}
              alt={`Upload ${idx + 1}`}
              className="w-full h-40 object-cover transition-all duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 text-xs text-white px-2 py-1 rounded">
              {upload.uploadedAt ? new Date(upload.uploadedAt).toLocaleString() : ''}
            </div>
          </div>
        ))}
      </div>
      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="relative max-w-2xl w-full mx-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-white/80 hover:text-white z-10" onClick={closeLightbox}>
              <X className="h-7 w-7" />
            </button>
            <img
              src={uploads[lightboxIdx].fileUrl}
              alt="Lightbox"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-fade-in"
            />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <button className="p-2 text-white/80 hover:text-white" onClick={prev}>
                <ChevronLeft className="h-8 w-8" />
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              <button className="p-2 text-white/80 hover:text-white" onClick={next}>
                <ChevronRight className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadGallery 