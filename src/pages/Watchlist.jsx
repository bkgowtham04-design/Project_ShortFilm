import React from 'react'
import { useNavigate } from 'react-router-dom'

const Watchlist = ({ watchlist, toggleWatchlist }) => {
  const navigate = useNavigate()

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`)
  }

  const handleRemove = (e, movie) => {
    e.stopPropagation() // Prevent navigating to movie details
    toggleWatchlist(movie)
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white pt-24 px-[4%] pb-10">
      <h1 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-2.5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cinema-red">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        My Watchlist
      </h1>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="text-6xl mb-2">🎬</div>
          <h2 className="text-xl md:text-2xl font-bold">Your Watchlist is Empty</h2>
          <p className="text-neutral-500 max-w-sm leading-relaxed mb-4">
            Explore our curated catalog of independent short films and add movies you want to save for later!
          </p>
          <button 
            className="bg-cinema-red hover:bg-cinema-red-hover text-white px-6 py-3 rounded-lg font-bold text-sm shadow-[0_4px_15px_rgba(229,9,20,0.4)] transition-all cursor-pointer"
            onClick={() => navigate('/')}
          >
            Explore Films
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlist.map(movie => (
            <div 
              key={movie.id} 
              className="group relative aspect-[16/9] rounded-lg overflow-hidden border border-white/5 bg-neutral-900 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 z-10 hover:z-20"
              onClick={() => handleCardClick(movie.id)}
            >
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <h3 className="text-white text-sm font-bold truncate pr-6">{movie.title}</h3>
                
                <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 font-bold">{movie.ratingScore} ★</span>
                    <span>{movie.duration}</span>
                  </div>
                  
                  {/* Remove icon button */}
                  <button 
                    onClick={(e) => handleRemove(e, movie)}
                    className="text-neutral-400 hover:text-cinema-red hover:scale-115 transition-all p-1 cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist
