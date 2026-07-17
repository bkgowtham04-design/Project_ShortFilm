import React, { useState, useEffect } from 'react'

const DirectorDashboard = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Drama',
    duration: '',
    posterUrl: '',
    videoUrl: '',
    description: ''
  })
  const [submissions, setSubmissions] = useState([])
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  // Load current user and director's movie submissions
  useEffect(() => {
    const savedUser = localStorage.getItem('cinestream_user')
    if (savedUser) {
      const userObj = JSON.parse(savedUser)
      setUser(userObj)
      
      const savedSubmissions = localStorage.getItem('cinestream_pending_movies')
      const submissionsList = savedSubmissions ? JSON.parse(savedSubmissions) : []
      
      // Filter submissions uploaded by this specific director
      setSubmissions(submissionsList.filter(s => s.directorEmail === userObj.email))
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { title, category, duration, posterUrl, videoUrl, description } = formData

    if (!title.trim() || !duration.trim() || !posterUrl.trim() || !videoUrl.trim() || !description.trim()) {
      setError('Please fill in all details.')
      return
    }

    const savedSubmissions = localStorage.getItem('cinestream_pending_movies')
    const allSubmissions = savedSubmissions ? JSON.parse(savedSubmissions) : []

    const newRequest = {
      id: `movie-${Date.now()}`,
      title,
      category,
      duration,
      posterUrl,
      videoUrl,
      description,
      status: 'pending', // pending, accepted, rejected
      directorName: user.name,
      directorEmail: user.email,
      releaseYear: new Date().getFullYear(),
      rating: 'G',
      ratingScore: '4.5',
      cast: ['Independent Cast']
    }

    const updatedSubmissions = [...allSubmissions, newRequest]
    localStorage.setItem('cinestream_pending_movies', JSON.stringify(updatedSubmissions))
    
    // Update local filter
    setSubmissions(updatedSubmissions.filter(s => s.directorEmail === user.email))

    // Clear form
    setFormData({
      title: '',
      category: 'Drama',
      duration: '',
      posterUrl: '',
      videoUrl: '',
      description: ''
    })

    alert('Movie uploaded successfully! Waiting for admin review.')
  }

  return (
    <div className="min-h-screen pt-24 px-[4%] pb-10 flex flex-col lg:flex-row gap-8 bg-[#141414]">
      {/* Upload Column */}
      <div className="w-full lg:w-[40%] bg-black/40 border border-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 h-fit shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Short Film</h2>
        <p className="text-neutral-400 text-sm mb-6">Submit details of your film for admin review and streaming catalog addition.</p>

        {error && (
          <div className="bg-cinema-red/10 border border-cinema-red/30 text-red-400 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider pl-1">Movie Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Flight of the Dragonfly" 
              className="bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none text-sm focus:border-cinema-red focus:bg-black/60 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider pl-1">Genre / Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-[#333]/90 border border-white/10 text-white px-4 py-3 rounded-lg outline-none text-sm focus:border-cinema-red focus:bg-black/60 transition-all cursor-pointer"
              >
                <option value="Action">Action</option>
                <option value="Drama">Drama</option>
                <option value="Comedy">Comedy</option>
                <option value="Sci-Fi">Sci-Fi</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider pl-1">Duration</label>
              <input 
                type="text" 
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 12 mins" 
                className="bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none text-sm focus:border-cinema-red focus:bg-black/60 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider pl-1">Poster Image URL</label>
            <input 
              type="url" 
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/... or cover link" 
              className="bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none text-sm focus:border-cinema-red focus:bg-black/60 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider pl-1">Streaming Video URL</label>
            <input 
              type="url" 
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://...mp4 direct video file link" 
              className="bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none text-sm focus:border-cinema-red focus:bg-black/60 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider pl-1">Description / Synopsis</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Write a brief overview of the plot..." 
              className="bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none text-sm focus:border-cinema-red focus:bg-black/60 transition-all resize-none"
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="bg-cinema-red text-white py-3.5 rounded-lg font-bold text-[15px] shadow-[0_4px_15px_rgba(229,9,20,0.4)] hover:bg-cinema-red-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_4px_10px_rgba(229,9,20,0.3)] transition-all duration-200 cursor-pointer mt-2"
          >
            Submit Film
          </button>
        </form>
      </div>

      {/* Submissions Column */}
      <div className="w-full lg:w-[60%] bg-black/40 border border-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">My Submissions</h2>
          <p className="text-neutral-400 text-sm">Status tracker of your uploaded pieces currently under admin review.</p>
        </div>

        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500 gap-4 border border-dashed border-white/10 rounded-xl bg-black/20">
            <span className="text-5xl">🎬</span>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">No Submissions Found</h3>
              <p className="text-sm text-neutral-500">Your uploaded films will appear here once you submit the upload form.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Poster</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3 pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="text-sm text-neutral-300 hover:bg-white/5 transition-colors">
                    <td className="py-3 pl-2">
                      <img 
                        src={sub.posterUrl} 
                        alt={sub.title} 
                        className="w-16 h-10 object-cover rounded border border-white/10"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=150&q=80' }}
                      />
                    </td>
                    <td className="py-3 font-semibold text-white max-w-[150px] truncate">{sub.title}</td>
                    <td className="py-3">{sub.category}</td>
                    <td className="py-3">{sub.duration}</td>
                    <td className="py-3 pr-2">
                      {sub.status === 'pending' && (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                      {sub.status === 'accepted' && (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          Accepted
                        </span>
                      )}
                      {sub.status === 'rejected' && (
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DirectorDashboard
