import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom'
import Navbar from './componets/Navbar'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import VideoPlayer from './pages/VideoPlayer'
import Watchlist from './pages/Watchlist'
import Search from './pages/Search'
import Footer from './pages/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import DirectorDashboard from './pages/DirectorDashboard'

import { movies as staticMovies } from './data/movies'

// ES6+ Protected Route Guards
const ProtectedRoute = ({ children }) => {
  const savedUser = localStorage.getItem('cinestream_user')
  return savedUser ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const savedUser = localStorage.getItem('cinestream_user')
  if (!savedUser) return <Navigate to="/login" replace />
  const user = JSON.parse(savedUser)
  return user.role === 'admin' ? children : <Navigate to="/" replace />
}

const DirectorRoute = ({ children }) => {
  const savedUser = localStorage.getItem('cinestream_user')
  if (!savedUser) return <Navigate to="/login" replace />
  const user = JSON.parse(savedUser)
  return user.role === 'director' ? children : <Navigate to="/" replace />
}

// Conditionally renders landing view based on user designation role
const LandingView = ({ movies, toggleWatchlist, watchlist, setActiveMovies }) => {
  const savedUser = localStorage.getItem('cinestream_user')
  if (!savedUser) return <Navigate to="/login" replace />
  const user = JSON.parse(savedUser)

  if (user.role === 'admin') {
    return <AdminDashboard movies={movies} setMovies={setActiveMovies} />
  }
  if (user.role === 'director') {
    return <DirectorDashboard />
  }
  return <Home movies={movies} toggleWatchlist={toggleWatchlist} watchlist={watchlist} />
}

const App = () => {
  // Load active movies list from localstorage or static fallback
  const [activeMovies, setActiveMovies] = useState(() => {
    const saved = localStorage.getItem('cinestream_movies')
    if (saved) {
      return JSON.parse(saved)
    } else {
      localStorage.setItem('cinestream_movies', JSON.stringify(staticMovies))
      return staticMovies
    }
  })

  // Sync watchlist
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('cinestream_watchlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cinestream_watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    // Save admin credentials in localStorage separately
    const adminCreds = {
      email: 'Gowtham18@gmail.com',
      password: 'admin@12345678'
    }
    localStorage.setItem('cinestream_admin_credentials', JSON.stringify(adminCreds))

    // Seed/sync into registered users list for compatibility and remove old admin seeds
    const savedUsers = localStorage.getItem('cinestream_registered_users')
    const users = savedUsers ? JSON.parse(savedUsers) : []
    const filteredUsers = users.filter(u => u.userRole !== 'admin' || u.userEmail.toLowerCase() === 'gowtham18@gmail.com')
    
    const adminExists = filteredUsers.some(u => u.userEmail.toLowerCase() === 'gowtham18@gmail.com')
    if (!adminExists) {
      const defaultAdmin = {
        userId: 'admin-seed',
        userName: 'Gowtham',
        userEmail: 'Gowtham18@gmail.com',
        userPassword: 'admin@12345678',
        userRole: 'admin'
      }
      localStorage.setItem('cinestream_registered_users', JSON.stringify([...filteredUsers, defaultAdmin]))
    } else {
      // Update existing admin's password if it was seeded with old password
      const updatedUsers = filteredUsers.map(u => {
        if (u.userEmail.toLowerCase() === 'gowtham18@gmail.com') {
          return { ...u, userPassword: 'admin@12345678' }
        }
        return u
      })
      localStorage.setItem('cinestream_registered_users', JSON.stringify(updatedUsers))
    }
  }, [])

  const toggleWatchlist = (movie) => {
    if (watchlist.some(m => m.id === movie.id)) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id))
    } else {
      setWatchlist([...watchlist, movie])
    }
  }

  const location = useLocation()
  
  // Toggle layout bars visibility on onboarding pages or player screen
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
          
          <Route path="/" element={
            <ProtectedRoute>
              <LandingView 
                movies={activeMovies} 
                toggleWatchlist={toggleWatchlist} 
                watchlist={watchlist} 
                setActiveMovies={setActiveMovies}
              />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard movies={activeMovies} setMovies={setActiveMovies} />
            </AdminRoute>
          } />

          <Route path="/director" element={
            <DirectorRoute>
              <DirectorDashboard />
            </DirectorRoute>
          } />

          <Route path="/movie/:id" element={
            <ProtectedRoute>
              <MovieDetails movies={activeMovies} toggleWatchlist={toggleWatchlist} watchlist={watchlist} />
            </ProtectedRoute>
          } />

          <Route path="/watch/:id" element={
            <ProtectedRoute>
              <VideoPlayer movies={activeMovies} />
            </ProtectedRoute>
          } />

          <Route path="/watchlist" element={
            <ProtectedRoute>
              <Watchlist watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
            </ProtectedRoute>
          } />

          <Route path="/search" element={
            <ProtectedRoute>
              <Search movies={activeMovies} toggleWatchlist={toggleWatchlist} watchlist={watchlist} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  )
}

export default App