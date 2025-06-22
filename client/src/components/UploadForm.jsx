import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { api } from '../api/api'
import { Loader2, UploadCloud, X } from 'lucide-react'

/**
 * UploadForm Component
 * Allows guests to upload images (jpg/png, max 5), with drag-and-drop, preview, and progress
 * @param {string} eventId - The event's unique ID
 * @param {function} onSuccess - Callback on successful upload
 * @param {function} onError - Callback on error
 */
const MAX_FILES = 5
const MAX_SIZE_MB = 10
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

const UploadForm = ({ eventId, onSuccess, onError }) => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Handle file drop
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length + files.length > MAX_FILES) {
      onError(`Max ${MAX_FILES} files allowed`)
      return
    }
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [files, onError])

  // Remove file from preview
  const removeFile = idx => setFiles(files => files.filter((_, i) => i !== idx))

  // Handle upload
  const handleUpload = async () => {
    if (!files.length) return onError('No files selected')
    setUploading(true)
    setProgress(0)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      formData.append('eventId', eventId)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded * 100) / e.total))
      })
      setFiles([])
      setProgress(0)
      onSuccess(res.data.upload)
    } catch (err) {
      onError(err.response?.data?.message || 'Upload failed')
    }
    setUploading(false)
  }

  // Dropzone config
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    multiple: true
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`drop-zone ${isDragActive ? 'drag-over' : ''} ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
        tabIndex={0}
        aria-label="Click or drag photos here to upload"
      >
        <input {...getInputProps()} disabled={uploading} />
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="h-10 w-10 text-primary-400 mb-2" />
          <h2 className="drop-zone-title text-lg font-semibold mb-1">Drop photos here</h2>
          <p className="drop-zone-subtitle text-white/60 mb-2">or click to browse</p>
          <div className="supported-formats text-xs text-white/50">JPG, PNG • Max 5 photos • Max 10MB each</div>
        </div>
      </div>
      {/* Preview */}
      {files.length > 0 && (
        <div className="preview-section mt-4">
          <h3 className="preview-title text-white/80 mb-2">Selected Photos</h3>
          <div className="preview-grid grid grid-cols-2 gap-2 mb-2">
            {files.map((file, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg shadow"
                />
                <button
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-red-500 transition"
                  onClick={() => removeFile(idx)}
                  type="button"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            className="btn-primary w-full flex items-center justify-center"
            onClick={handleUpload}
            disabled={uploading}
            type="button"
          >
            {uploading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            {uploading ? `Uploading... (${progress}%)` : 'Upload to MOMNT'}
          </button>
          {uploading && (
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UploadForm 