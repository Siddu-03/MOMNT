import { useState } from 'react'
import { Copy, RefreshCcw } from 'lucide-react'
import QRCode from 'qrcode.react'
import toast from 'react-hot-toast'

/**
 * QRCodeBox Component
 * Displays a QR code for the event upload link, allows copy/regenerate
 * @param {string} eventId - The event's unique ID
 */
const QRCodeBox = ({ eventId }) => {
  const [qrKey, setQrKey] = useState(Date.now())
  const eventUrl = `${window.location.origin}/upload/${eventId}`

  // Regenerate QR code (forces re-render)
  const handleRegenerate = () => {
    setQrKey(Date.now())
    toast.success('QR code regenerated!')
  }

  // Copy event link to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      toast.success('Link copied!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="qr-container flex flex-col items-center gap-2 mt-2">
      <QRCode value={eventUrl} size={128} key={qrKey} className="rounded-lg shadow-lg" />
      <div className="flex gap-2 mt-2">
        <button
          className="btn-outline flex items-center"
          onClick={handleCopy}
          title="Copy link"
        >
          <Copy className="h-4 w-4 mr-1" /> Copy Link
        </button>
        <button
          className="btn-secondary flex items-center"
          onClick={handleRegenerate}
          title="Regenerate QR"
        >
          <RefreshCcw className="h-4 w-4 mr-1" /> Regenerate
        </button>
      </div>
      <div className="text-xs text-white/60 mt-1 text-center break-all">
        {eventUrl}
      </div>
    </div>
  )
}

export default QRCodeBox 