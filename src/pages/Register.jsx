import React, { useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const getInitialState = () => {
  const saved = localStorage.getItem('cinestream_registered_users')
  return saved ? JSON.parse(saved) : []
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const newState = [...state, action.payload]
      localStorage.setItem('cinestream_registered_users', JSON.stringify(newState))
      return newState
    }
    default:
      return state
  }
}

const Register = () => {
  const navigate = useNavigate()
  const [registeredUsers, dispatch] = useReducer(authReducer, null, getInitialState)
  const [formData, setFormData] = useState({ 
    userName: '', 
    userEmail: '', 
    userPassword: '',
    userRole: 'user'
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { userName, userEmail, userPassword } = formData

    if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) {
      setError('All fields are required.')
      return
    }

    if (userPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    // Check if email already registered
    if (registeredUsers.some(u => u.userEmail.toLowerCase() === userEmail.toLowerCase())) {
      setError('Email is already registered.')
      return
    }

    const unique = { userId: Date.now(), ...formData }
    
    dispatch({
      type: 'ADD',
      payload: unique
    })

    alert('Successfully Registered!')
    navigate('/login')
  }

  return (
    <div 
      className="flex items-center justify-center min-h-screen w-full p-5 relative bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.8) 100%), url('/auth-bg.jpg')`
      }}
    >
      {/* Dimmed Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 bg-black/75 rounded-md px-10 py-12 md:px-16 md:py-16 w-full max-w-[450px] shadow-2xl flex flex-col gap-6">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Sign Up</h2>
        </div>

        {error && (
          <div className="bg-cinema-red/10 border border-cinema-red/30 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input 
              type="text" 
              name="userName"
              autoComplete="off"
              className="w-full bg-[#333]/90 text-white rounded px-5 py-4 text-[15px] placeholder-neutral-400 outline-none focus:bg-[#454545]/90 transition-all duration-150" 
              placeholder="Full Name" 
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative w-full">
            <input 
              type="email" 
              name="userEmail"
              autoComplete="off"
              className="w-full bg-[#333]/90 text-white rounded px-5 py-4 text-[15px] placeholder-neutral-400 outline-none focus:bg-[#454545]/90 transition-all duration-150" 
              placeholder="Email address" 
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative w-full flex items-center">
            <input 
              type={showPassword ? "text" : "password"} 
              name="userPassword"
              autoComplete="new-password"
              className="w-full bg-[#333]/90 text-white rounded pl-5 pr-16 py-4 text-[15px] placeholder-neutral-400 outline-none focus:bg-[#454545]/90 transition-all duration-150" 
              placeholder="Password" 
              value={formData.userPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider hover:text-white transition-colors duration-150 cursor-pointer select-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Role selection dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider pl-1">Designation / Role</label>
            <select 
              name="userRole"
              className="w-full bg-[#333]/90 text-white rounded px-5 py-3.5 text-[15px] outline-none focus:bg-[#454545]/90 transition-all duration-150 cursor-pointer"
              value={formData.userRole}
              onChange={handleChange}
            >
              <option value="user">User (Viewer)</option>
              <option value="director">Director (Creator)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#e50914] hover:bg-[#c11119] text-white py-3.5 rounded font-bold text-[16px] transition-all duration-200 mt-4 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="flex flex-col gap-4 mt-2">
          {/* Sign In Link */}
          <div className="text-[15px] text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline font-medium">
              Sign in now.
            </Link>
          </div>

          {/* reCAPTCHA Info */}
          <div className="text-[13px] text-neutral-500 leading-snug">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <span className="text-[#0071eb] hover:underline cursor-pointer">Learn more.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
