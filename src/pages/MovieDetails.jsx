import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const MovieDetails = ({ movies, watchlist, toggleWatchlist }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const movie = movies.find(m => m.id === id)

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-5 bg-[#141414] text-white">
        <span className="text-5xl mb-4">🎬</span>
        <h2 className="text-2xl font-bold">Film Not Found</h2>
        <p className="text-neutral-400 mt-2 max-w-sm">The film you are trying to view does not exist in our library.</p>
        <button 
          className="bg-cinema-red text-white px-6 py-2.5 rounded-lg font-bold text-sm mt-6 cursor-pointer hover:bg-cinema-red-hover"
          onClick={() => navigate('/')}
        >
          Go Back Home
        </button>
      </div>
    )
  }

  const isSaved = watchlist.some(m => m.id === movie.id)
  
  // Recommendations list
  const recommendations = movies.filter(m => m.category === movie.category && m.id !== movie.id)

  return (
    <div className="bg-[#141414] min-h-screen text-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-10">
        
        {/* Poster segment */}
        <div className="w-full md:w-[320px] aspect-[2/3] md:h-[480px] rounded-xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/5 bg-neutral-900 flex-shrink-0">
          <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
        </div>

        {/* Details segment */}
        <div className="flex-grow flex flex-col gap-4">
          <span className="text-cinema-red font-bold text-sm uppercase tracking-wider">{movie.category}</span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight text-white">{movie.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
            <span className="text-yellow-500 font-bold">{movie.ratingScore} ★ Rating</span>
            <span>{movie.releaseYear}</span>
            <span className="border border-neutral-600 px-1.5 py-0.5 rounded text-[11px] font-bold">{movie.rating}</span>
            <span>{movie.duration}</span>
          </div>

          <p className="text-neutral-300 text-base md:text-lg leading-relaxed mt-2">{movie.description}</p>

          {/* Cast / Director specs grid */}
          <div className="grid grid-cols-[auto_1fr] row-gap-3 column-gap-5 border-t border-white/10 pt-5 mt-3 text-sm">
            <span className="text-neutral-400 font-medium">Directed By:</span>
            <span className="text-white font-semibold">{movie.director}</span>
            
            <span className="text-neutral-400 font-medium mt-1">Starring:</span>
            <span className="text-white font-semibold mt-1">
              {Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <button 
              className="bg-white hover:bg-neutral-200 text-black px-6 py-3 rounded-lg font-bold text-sm md:text-base flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              onClick={() => navigate(`/watch/${movie.id}`)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Watch Now
            </button>
            <button 
              className="bg-white/10 border border-white/25 hover:bg-white/15 text-white px-6 py-3 rounded-lg font-bold text-sm md:text-base flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              onClick={() => toggleWatchlist(movie)}
            >
              {isSaved ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-cinema-red">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Remove from Watchlist
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Add to Watchlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Related Content list */}
      {recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">More Like This</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none pr-[4%]">
            {recommendations.map(rec => (
              <div 
                key={rec.id} 
                className="group relative flex-shrink-0 w-[240px] aspect-[16/9] rounded-lg overflow-hidden border border-white/5 bg-neutral-900 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 z-10 hover:z-20"
                onClick={() => navigate(`/movie/${rec.id}`)}
              >
                <img src={rec.posterUrl} alt={rec.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <h3 className="text-white text-sm font-bold truncate">{rec.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                    <span className="text-yellow-500 font-bold">{rec.ratingScore} ★</span>
                    <span>{rec.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetails
