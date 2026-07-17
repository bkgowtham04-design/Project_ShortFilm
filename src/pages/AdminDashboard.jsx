import React, { useState, useEffect } from 'react'

const AdminDashboard = ({ movies, setMovies }) => {
  const [pendingQueue, setPendingQueue] = useState([])
  const [stats, setStats] = useState({
    activeCount: 0,
    pendingCount: 0,
    accountsCount: 0
  })

  // Load pending list and calculate stats
  useEffect(() => {
    loadDashboardData()
  }, [movies])

  const loadDashboardData = () => {
    const savedSubmissions = localStorage.getItem('cinestream_pending_movies')
    const submissionsList = savedSubmissions ? JSON.parse(savedSubmissions) : []
    const pendingItems = submissionsList.filter(s => s.status === 'pending')
    setPendingQueue(pendingItems)

    const savedAccounts = localStorage.getItem('cinestream_registered_users')
    const accountsList = savedAccounts ? JSON.parse(savedAccounts) : []

    setStats({
      activeCount: movies.length,
      pendingCount: pendingItems.length,
      accountsCount: accountsList.length
    })
  }

  const handleAccept = (movieRequest) => {
    // 1. Update status in submissions DB
    const savedSubmissions = localStorage.getItem('cinestream_pending_movies')
    const submissionsList = savedSubmissions ? JSON.parse(savedSubmissions) : []
    
    const updatedSubmissions = submissionsList.map(s => {
      if (s.id === movieRequest.id) {
        return { ...s, status: 'accepted' }
      }
      return s
    })
    localStorage.setItem('cinestream_pending_movies', JSON.stringify(updatedSubmissions))

    // 2. Add movie to the active catalog
    const newCatalogMovie = {
      id: movieRequest.id,
      title: movieRequest.title,
      description: movieRequest.description,
      category: movieRequest.category,
      duration: movieRequest.duration,
      rating: movieRequest.rating || 'G',
      ratingScore: movieRequest.ratingScore || '4.5',
      releaseYear: movieRequest.releaseYear || new Date().getFullYear(),
      director: movieRequest.directorName,
      cast: movieRequest.cast || ['Independent Cast'],
      posterUrl: movieRequest.posterUrl,
      videoUrl: movieRequest.videoUrl
    }

    const updatedCatalog = [...movies, newCatalogMovie]
    setMovies(updatedCatalog) // This automatically syncs to localStorage.setItem('cinestream_movies') inside App.jsx
    
    alert(`Successfully approved and added "${movieRequest.title}" to active streaming catalog!`)
    loadDashboardData()
  }

  const handleReject = (movieRequest) => {
    // Update status to rejected
    const savedSubmissions = localStorage.getItem('cinestream_pending_movies')
    const submissionsList = savedSubmissions ? JSON.parse(savedSubmissions) : []
    
    const updatedSubmissions = submissionsList.map(s => {
      if (s.id === movieRequest.id) {
        return { ...s, status: 'rejected' }
      }
      return s
    })
    localStorage.setItem('cinestream_pending_movies', JSON.stringify(updatedSubmissions))

    alert(`Rejected submission for "${movieRequest.title}".`)
    loadDashboardData()
  }

  return (
    <div className="min-h-screen pt-24 px-[4%] pb-10 bg-[#141414] flex flex-col gap-8">
      {/* Stats Counter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-white/5 backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col gap-1">
          <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Active Catalog</span>
          <span className="text-3xl font-extrabold text-white">{stats.activeCount} Films</span>
        </div>
        <div className="bg-black/40 border border-white/5 backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col gap-1">
          <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Pending Submissions</span>
          <span className="text-3xl font-extrabold text-yellow-500">{stats.pendingCount} Queue</span>
        </div>
        <div className="bg-black/40 border border-white/5 backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col gap-1">
          <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Registered Accounts</span>
          <span className="text-3xl font-extrabold text-cinema-red">{stats.accountsCount} Users</span>
        </div>
      </div>

      {/* Main Review Center */}
      <div className="bg-black/40 border border-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Approval Queue</h2>
          <p className="text-neutral-400 text-sm">Review incoming short film submissions from registered directors.</p>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-500 gap-4 border border-dashed border-white/10 rounded-xl bg-black/20">
            <span className="text-5xl">✅</span>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Queue is Clear</h3>
              <p className="text-sm text-neutral-500">There are no pending film submissions to review right now.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pendingQueue.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col md:flex-row gap-6 p-5 border border-white/5 bg-black/20 rounded-xl hover:border-white/10 transition-colors"
              >
                {/* Poster image preview */}
                <div className="w-full md:w-[220px] aspect-[16/9] md:aspect-auto md:h-[130px] rounded-lg overflow-hidden border border-white/10 bg-neutral-900 flex-shrink-0">
                  <img 
                    src={item.posterUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=150&q=80' }}
                  />
                </div>

                {/* Details column */}
                <div className="flex-grow flex flex-col gap-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <span className="text-xs font-bold text-neutral-400 bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Duration: <strong className="text-neutral-200">{item.duration}</strong></span>
                    <span>Director: <strong className="text-neutral-200">{item.directorName} ({item.directorEmail})</strong></span>
                  </div>

                  <p className="text-sm text-neutral-300 line-clamp-3 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>

                {/* Controls Column */}
                <div className="flex md:flex-col justify-center gap-3 flex-shrink-0 w-full md:w-[150px] border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => handleAccept(item)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-sm shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Accept
                  </button>
                  <button 
                    onClick={() => handleReject(item)}
                    className="flex-1 bg-black/40 border border-white/10 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 py-2.5 rounded-lg font-bold text-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
