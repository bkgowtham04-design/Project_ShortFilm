import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './componets/Navbar'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import VideoPlayer from './pages/VideoPlayer'
import Watchlist from './pages/Watchlist'
import Search from './pages/Search'
import Footer from './pages/Footer'
import Login from './pages/Login'
import Register from './pages/Register'

// ES6+ Arrow Function component for route protection
const ProtectedRoute = ({ children }) => {
  const savedUser = localStorage.getItem('cinestream_user')
  return savedUser ? children : <Navigate to="/login" replace />
}

const App = () => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('cinestream_watchlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cinestream_watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const toggleWatchlist = (movie) => {
    if (watchlist.some(m => m.id === movie.id)) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id))
    } else {
      setWatchlist([...watchlist, movie])
    }
  }

  const location = useLocation()
  
  // Hide Navbar & Footer on auth pages or player view
  const hideLayout = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname.startsWith('/watch/')

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar watchlistCount={watchlist.length} />}
      <main className={`flex-grow ${hideLayout ? '' : 'pb-[60px]'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home toggleWatchlist={toggleWatchlist} watchlist={watchlist} /></ProtectedRoute>} />
          <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails toggleWatchlist={toggleWatchlist} watchlist={watchlist} /></ProtectedRoute>} />
          <Route path="/watch/:id" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
          <Route path="/watchlist" element={<ProtectedRoute><Watchlist watchlist={watchlist} toggleWatchlist={toggleWatchlist} /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search toggleWatchlist={toggleWatchlist} watchlist={watchlist} /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}

export default App