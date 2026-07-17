import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ watchlistCount }) => {
  const [scrolled, setScrolled] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Track scroll position for header opacity change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sync search input and retrieve user session
  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search)
      setSearchVal(params.get('q') || '')
    } else {
      setSearchVal('')
    }

    const savedUser = localStorage.getItem('cinestream_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setUser(null)
    }
  }, [location])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchVal(value)
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`)
    } else {
      navigate('/search')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('cinestream_user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 h-[70px] flex items-center justify-between px-[4%] z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#141414] border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-gradient-to-b from-black/90 to-transparent'
    }`}>
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl md:text-3xl font-black tracking-wider bg-gradient-to-r from-cinema-red to-[#ff4b55] bg-clip-text text-transparent transition-all duration-150 hover:brightness-110">
          CINESTREAM
        </Link>
        {user && (
          <ul className="flex items-center gap-5 list-none">
            <li>
              <Link 
                to="/" 
                className={`text-sm font-medium transition-all duration-150 relative py-1 ${
                  isActive('/') ? 'text-white after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-cinema-red after:rounded after:shadow-[0_0_8px_#e50914]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/watchlist" 
                className={`text-sm font-medium transition-all duration-150 relative py-1 ${
                  isActive('/watchlist') ? 'text-white after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-cinema-red after:rounded after:shadow-[0_0_8px_#e50914]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Watchlist
              </Link>
            </li>
          </ul>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-5">
          {/* Search Box */}
          <div className="relative flex items-center">
            <svg
              className="absolute left-3 text-neutral-400 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="bg-white/10 border border-white/15 text-white pl-9 pr-3 py-1.5 rounded-full outline-none text-sm w-[160px] md:w-[200px] transition-all duration-300 focus:w-[240px] md:focus:w-[280px] focus:border-cinema-red focus:shadow-[0_0_10px_rgba(229,9,20,0.25)] focus:bg-white/15"
              placeholder="Search films..."
              value={searchVal}
              onChange={handleSearchChange}
            />
          </div>

          {/* Watchlist Counter */}
          <Link to="/watchlist" className="relative flex items-center" aria-label="Watchlist">
            <svg
              className="text-white hover:text-cinema-red transition-colors duration-200 cursor-pointer"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {watchlistCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-cinema-red text-white text-[11px] font-bold w-[18px] height-[18px] rounded-full flex items-center justify-center shadow-[0_0_8px_#e50914] aspect-square">
                {watchlistCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          <div className="flex items-center gap-4 border-l border-white/15 pl-4">
            <span className="text-sm text-neutral-300 hidden sm:inline">
              Hi, <strong className="text-white capitalize font-bold">{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="text-neutral-400 hover:text-cinema-red hover:scale-105 active:scale-95 transition-all duration-200 p-1 cursor-pointer flex items-center"
              title="Sign Out"
              aria-label="Sign out"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
