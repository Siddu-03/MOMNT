import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/api'
import QRCodeBox from '../components/QRCodeBox'
import UploadGallery from '../components/UploadGallery'
import toast from 'react-hot-toast'
import { Plus, Trash2, Calendar, Image as ImageIcon } from 'lucide-react'

/**
 * Dashboard Page
 * Hosts can create events, view/manage their events, see QR codes, and view uploads
 */
const Dashboard = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', date: '', image: null })
  const [creating, setCreating] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [uploads, setUploads] = useState([])
  const [uploadsLoading, setUploadsLoading] = useState(false)

  // Fetch host's events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const res = await api.get('/events/host')
        setEvents(res.data.events)
      } catch (err) {
        toast.error('Failed to load events')
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  // Fetch uploads for selected event
  useEffect(() => {
    if (!selectedEvent) return
    const fetchUploads = async () => {
      setUploadsLoading(true)
      try {
        const res = await api.get(`/events/${selectedEvent._id}/uploads`)
        setUploads(res.data.uploads)
      } catch (err) {
        toast.error('Failed to load uploads')
      }
      setUploadsLoading(false)
    }
    fetchUploads()
  }, [selectedEvent])

  // Handle event creation
  const handleCreateEvent = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const formData = new FormData()
      formData.append('title', newEvent.title)
      formData.append('date', newEvent.date)
      if (newEvent.image) formData.append('image', newEvent.image)
      const res = await api.post('/events/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setEvents([res.data.event, ...events])
      setShowCreate(false)
      setNewEvent({ title: '', date: '', image: null })
      toast.success('Event created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event')
    }
    setCreating(false)
  }

  // Handle event delete (future moderation)
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return
    try {
      await api.delete(`/events/${eventId}`)
      setEvents(events.filter(ev => ev._id !== eventId))
      toast.success('Event deleted')
      setSelectedEvent(null)
    } catch (err) {
      toast.error('Failed to delete event')
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Your Events</h1>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          className="btn-primary flex items-center"
          onClick={() => setShowCreate(!showCreate)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Event
        </button>
      </div>
      {showCreate && (
        <form onSubmit={handleCreateEvent} className="card mb-8 space-y-4">
          <div>
            <label className="block text-white/80 mb-1">Event Title</label>
            <input
              type="text"
              className="input-field"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Date</label>
            <input
              type="date"
              className="input-field"
              value={newEvent.date}
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Optional Cover Image</label>
            <input
              type="file"
              accept="image/*"
              className="input-field"
              onChange={e => setNewEvent({ ...newEvent, image: e.target.files[0] })}
            />
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center"
            disabled={creating}
          >
            {creating ? <span className="spinner mr-2"></span> : null}
            Create
          </button>
        </form>
      )}
      {loading ? (
        <div className="text-white/70">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-white/70">No events yet. Create your first event!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {events.map(event => (
            <div
              key={event._id}
              className={`card-hover cursor-pointer ${selectedEvent?._id === event._id ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-400" />
                  <span className="font-semibold text-white">{event.title}</span>
                </div>
                <button
                  className="text-red-400 hover:text-red-600 transition-colors"
                  onClick={e => { e.stopPropagation(); handleDeleteEvent(event._id) }}
                  title="Delete event"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="text-white/60 text-sm mb-2">{new Date(event.date).toLocaleDateString()}</div>
              {event.coverImageUrl && (
                <img src={event.coverImageUrl} alt="Event cover" className="w-full h-32 object-cover rounded-lg mb-2" />
              )}
              <QRCodeBox eventId={event._id} />
            </div>
          ))}
        </div>
      )}
      {selectedEvent && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Uploads for: {selectedEvent.title}</h2>
          <UploadGallery uploads={uploads} loading={uploadsLoading} />
        </div>
      )}
    </div>
  )
}

export default Dashboard 