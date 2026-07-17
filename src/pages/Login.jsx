import React, { useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DefaultUser = {}

const Login = () => {
  const goto = useNavigate()

  // Retrieve registered users from localStorage
  const getRegisteredUsers = () => {
    const saved = localStorage.getItem('cinestream_registered_users')
    return saved ? JSON.parse(saved) : []
  }

  const reduce = (state, action) => {
    switch (action.type) {
      case "AUTH": {
        // Direct bulletproof check for admin credentials
        const adminEmail = ''
        const adminPassword = ''

        if (action.payload.userEmail.toLowerCase() === adminEmail.toLowerCase() && 
            action.payload.userPassword === adminPassword) {
          
          // Ensure it is stored in localStorage separately
          localStorage.setItem('cinestream_admin_credentials', JSON.stringify({
            email: adminEmail,
            password: adminPassword
          }))

          const sessionUser = {
            name: 'Gowtham',
            email: adminEmail,
            role: 'admin'
          }
          localStorage.setItem('cinestream_user', JSON.stringify(sessionUser))
          goto('/')
          return { userName: 'Gowtham', userEmail: adminEmail, userRole: 'admin' }
        }

        // Fall back to registered users catalog
        const data = getRegisteredUsers()
        const validate = data.find(
          (e) => e.userEmail.toLowerCase() === action.payload.userEmail.toLowerCase() && 
                 e.userPassword === action.payload.userPassword
        )

        if (validate) {
          // Save active session
          const sessionUser = {
            name: validate.userName || validate.userEmail.split('@')[0],
            email: validate.userEmail,
            role: validate.userRole || 'user'
          }
          localStorage.setItem('cinestream_user', JSON.stringify(sessionUser))
          goto('/')
          return validate
        } else {
          alert("You are not a valid user")
          return state
        }
      }
      default:
        return state
    }
  }

  const [loginUser, dispatch] = useReducer(reduce, DefaultUser)
  const [currentUser, setCurrentUser] = useState({ userEmail: "", userPassword: "" })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({
      type: "AUTH",
      payload: currentUser
    })
  }

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen w-full p-5 relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.3) 100%), url('/auth-bg.jpg')`
      }}
    >
      {/* Floating Logo Header */}
      <header className="absolute top-0 left-0 w-full px-[6%] py-6 z-20">
        <span className="text-3xl font-black tracking-wider bg-gradient-to-r from-cinema-red to-[#ff4b55] bg-clip-text text-transparent select-none">
          CINESTREAM
        </span>
      </header>

      {/* Dimmed Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 bg-black/75 rounded-md px-10 py-12 md:px-16 md:py-16 w-full max-w-[450px] shadow-2xl flex flex-col gap-6">
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">Sign In</h2>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <input 
              type="email" 
              name="userEmail"
              autoComplete="off"
              className="w-full bg-[#333]/90 text-white rounded px-5 py-4 text-[15px] placeholder-neutral-400 outline-none focus:bg-[#454545]/90 transition-all duration-150" 
              placeholder="Email or phone number" 
              value={currentUser.userEmail}
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
              value={currentUser.userPassword}
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

          <button 
            type="submit" 
            className="w-full bg-[#e50914] hover:bg-[#c11119] text-white py-3.5 rounded font-bold text-[16px] transition-all duration-200 mt-4 cursor-pointer"
          >
            Sign In
          </button>

          <div className="flex items-center justify-between text-[13px] text-neutral-400 font-medium mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                name="rememberMe"
                className="accent-neutral-500 w-4 h-4 cursor-pointer rounded-sm border-none bg-neutral-700" 
              />
              Remember me
            </label>
            <span className="hover:underline cursor-pointer">Need help?</span>
          </div>
        </form>

        <div className="flex flex-col gap-4 mt-2">
          {/* Facebook Login */}
          <div className="flex items-center gap-2.5 text-[13px] text-neutral-400 cursor-pointer hover:text-white transition-colors duration-150">
            <svg className="fill-neutral-400 w-5 h-5" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
            <span>Login with Facebook</span>
          </div>

          {/* Registration Trigger */}
          <div className="text-[15px] text-neutral-400">
            New to CineStream?{' '}
            <Link to="/register" className="text-white hover:underline font-medium">
              Sign up now.
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

export default Login
