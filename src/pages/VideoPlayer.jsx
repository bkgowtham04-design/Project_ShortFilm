import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const VideoPlayer = ({ movies }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const movie = movies.find(m => m.id === id)

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-5 text-center">
        <span className="text-5xl mb-4">🍿</span>
        <h2 className="text-2xl font-bold">Video Not Found</h2>
        <button 
          className="bg-cinema-red text-white px-6 py-2.5 rounded-lg font-bold text-sm mt-6 cursor-pointer hover:bg-cinema-red-hover"
          onClick={() => navigate('/')}
        >
          Go Back Home
        </button>
      </div>
    )
  }

  const handleBack = () => {
    navigate(`/movie/${movie.id}`)
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Return button */}
      <button 
        className="absolute top-6 left-6 bg-black/60 text-white border border-white/15 rounded-full w-12 h-12 flex items-center justify-center hover:bg-cinema-red hover:border-cinema-red hover:scale-110 hover:shadow-[0_0_15px_#e50914] active:scale-95 transition-all duration-150 cursor-pointer z-55 backdrop-blur-md"
        onClick={handleBack}
        title="Back to Details"
        aria-label="Back to details"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      {/* HTML5 video element */}
      <video 
        className="w-full h-full object-contain" 
        src={movie.videoUrl} 
        controls 
        autoPlay
        playsInline
      >
        Your browser does not support the video tag or playback.
      </video>
    </div>
  )
}

export default VideoPlayer