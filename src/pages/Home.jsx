import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = ({ movies, watchlist, toggleWatchlist }) => {
  const navigate = useNavigate()
  
  // Use first movie as featured hero film
  const heroMovie = movies.find(m => m.id === 'tears-of-steel') || movies[0]

  const handlePlayClick = (id) => {
    navigate(`/watch/${id}`)
  }

  const handleInfoClick = (id) => {
    navigate(`/movie/${id}`)
  }

  // Categories list
  const categories = ['Sci-Fi', 'Drama', 'Comedy', 'Action']

  return (
    <div className="bg-[#141414] min-h-screen text-white pb-10">
      {/* Hero Banner */}
      {heroMovie && (
        <div 
          className="relative h-[75vh] w-full flex items-center px-[4%] bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.9) 0%, rgba(20,20,20,0.5) 50%, rgba(20,20,20,0) 80%), linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0) 50%), url(${heroMovie.posterUrl})` 
          }}
        >
          <div className="relative z-10 max-w-[650px] flex flex-col gap-4">
            <span className="text-cinema-red font-bold text-sm uppercase tracking-widest">
              Featured {heroMovie.category} Short Film
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-white drop-shadow-md">
              {heroMovie.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <span>{heroMovie.releaseYear}</span>
              <span className="border border-neutral-500 px-1.5 py-0.5 rounded text-[11px] font-bold">{heroMovie.rating}</span>
              <span>{heroMovie.duration}</span>
              <span className="text-yellow-500 font-bold">{heroMovie.ratingScore} ★</span>
            </div>
            <p className="text-neutral-300 text-base md:text-lg leading-relaxed line-clamp-3">
              {heroMovie.description}
            </p>
            <div className="flex gap-4 mt-2">
              <button 
                className="bg-white hover:bg-neutral-200 text-black px-6 py-3 rounded-lg font-bold text-sm md:text-base flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                onClick={() => handlePlayClick(heroMovie.id)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Play
              </button>
              <button 
                className="bg-neutral-600/70 hover:bg-neutral-600/40 text-white px-6 py-3 rounded-lg font-bold text-sm md:text-base flex items-center gap-2 backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                onClick={() => handleInfoClick(heroMovie.id)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categorized Movie Rows */}
      <div className="mt-[-40px] relative z-10 flex flex-col gap-6">
        
        {/* Row 1: Trending Now */}
        <div className="pl-[4%] py-2">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Trending Now</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none pr-[4%]">
            {movies.map(movie => (
              <div 
                key={movie.id} 
                className="group relative flex-shrink-0 w-[240px] aspect-[16/9] rounded-lg overflow-hidden border border-white/5 bg-neutral-900 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 z-10 hover:z-20"
                onClick={() => handleInfoClick(movie.id)}
              >
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <h3 className="text-white text-sm font-bold truncate">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                    <span className="text-yellow-500 font-bold">{movie.ratingScore} ★</span>
                    <span>{movie.duration}</span>
                    <span>{movie.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Category Rows */}
        {categories.map(category => {
          const categoryMovies = movies.filter(m => m.category === category)
          if (categoryMovies.length === 0) return null
          
          return (
            <div key={category} className="pl-[4%] py-2">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{category} Hits</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none pr-[4%]">
                {categoryMovies.map(movie => (
                  <div 
                    key={movie.id} 
                    className="group relative flex-shrink-0 w-[240px] aspect-[16/9] rounded-lg overflow-hidden border border-white/5 bg-neutral-900 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 z-10 hover:z-20"
                    onClick={() => handleInfoClick(movie.id)}
                  >
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <h3 className="text-white text-sm font-bold truncate">{movie.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                        <span className="text-yellow-500 font-bold">{movie.ratingScore} ★</span>
                        <span>{movie.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default Home
