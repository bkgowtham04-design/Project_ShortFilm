import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const Search = ({ movies, watchlist, toggleWatchlist }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Categories list
  const categories = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi']

  useEffect(() => {
    // If the query matches one of our genres, select it automatically
    const matchingGenre = categories.find(c => c.toLowerCase() === query.toLowerCase())
    if (matchingGenre) {
      setSelectedCategory(matchingGenre)
    } else {
      setSelectedCategory('All')
    }
  }, [query])

  // Filter movies based on category tag AND text search query
  const filteredMovies = movies.filter(movie => {
    // Category match
    const categoryMatch = selectedCategory === 'All' || movie.category === selectedCategory
    
    // Text search match
    const searchMatch = !query.trim() || 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.description.toLowerCase().includes(query.toLowerCase()) ||
      movie.category.toLowerCase().includes(query.toLowerCase()) ||
      movie.director.toLowerCase().includes(query.toLowerCase()) ||
      movie.cast.some(actor => actor.toLowerCase().includes(query.toLowerCase()))
      
    return categoryMatch && searchMatch
  })

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`)
  }

  const handleTagClick = (category) => {
    setSelectedCategory(category)
    if (query && categories.find(c => c.toLowerCase() === query.toLowerCase())) {
      navigate('/search')
    }
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white pt-24 px-[4%] pb-10">
      <h1 className="text-2xl md:text-3xl font-black mb-6">
        {query ? `Search Results for "${query}"` : 'Explore Films'}
      </h1>

      {/* Category filter pills */}
      <div className="flex gap-3 flex-wrap mb-8">
        {categories.map(category => (
          <button
            key={category}
            className={`px-5 py-1.5 rounded-full border text-sm font-semibold cursor-pointer transition-all duration-150 ${
              selectedCategory === category
                ? 'bg-cinema-red border-cinema-red text-white shadow-[0_0_8px_rgba(229,9,20,0.4)]'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => handleTagClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {filteredMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 text-neutral-500">
          <span className="text-5xl">🔍</span>
          <h2 className="text-xl font-bold text-white">No Results Found</h2>
          <p className="text-sm max-w-xs leading-relaxed">
            We couldn't find any matches. Try checking your spelling or exploring other categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map(movie => (
            <div 
              key={movie.id} 
              className="group relative aspect-[16/9] rounded-lg overflow-hidden border border-white/5 bg-neutral-900 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 z-10 hover:z-20"
              onClick={() => handleCardClick(movie.id)}
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
      )}
    </div>
  )
}

export default Search
