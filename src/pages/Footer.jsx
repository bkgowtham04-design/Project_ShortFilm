import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#111] border-t border-white/5 text-neutral-400 py-12 px-[4%] text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        
        {/* Brand overview */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link to="/" className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cinema-red to-[#ff4b55] bg-clip-text text-transparent w-fit">
            CINESTREAM
          </Link>
          <p className="text-neutral-500 leading-relaxed text-sm max-w-sm">
            The premier hub for short films and independent filmmakers. Stream handpicked cinematic pieces, manage your watchlist, and discover talented creators globally.
          </p>
        </div>
        
        {/* Column 1 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-[15px]">Browse</h4>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/search?q=Action" className="hover:text-white transition-colors">Action</Link>
          <Link to="/search?q=Sci-Fi" className="hover:text-white transition-colors">Sci-Fi</Link>
          <Link to="/search?q=Comedy" className="hover:text-white transition-colors">Comedy</Link>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-[15px]">Watchlist</h4>
          <Link to="/watchlist" className="hover:text-white transition-colors">My Watchlist</Link>
          <Link to="/" className="hover:text-white transition-colors">History</Link>
          <Link to="/" className="hover:text-white transition-colors">Favorites</Link>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-[15px]">Legal</h4>
          <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-white transition-colors">Help Center</Link>
        </div>
      </div>
      
      {/* Bottom copyright line */}
      <div className="max-w-6xl mx-auto border-t border-white/5 mt-10 pt-6 text-center text-xs text-neutral-600">
        <p>&copy; {new Date().getFullYear()} CineStream. All Rights Reserved. Built for short film lovers.</p>
      </div>
    </footer>
  )
}

export default Footer
