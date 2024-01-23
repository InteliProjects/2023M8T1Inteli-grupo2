// Router component, responsible for managing routes and navigation.
// Includes:
// - Importing global and specific styles for notifications (react-toastify).
// - Using React Router to define routes and render specific page components.
// - Page components such as Login, Home, Projects, Patients, Game (DragDrop), Editor.
// - Authentication context (`AuthProvider`) wrapping the routes.
// - Logic to show or hide the Navbar based on the current route.
// - Toast notifications container.

// import '../assets/styles/global.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from '../pages/Login'
import { useState, useEffect, ReactElement } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DEFAULT_THEME } from '@renderer/themes'
import { applyTheme } from '@renderer/themes/utils'
import { AuthProvider } from '@renderer/contexts/AuthContext'
import Home from '@renderer/pages/Home'
import Projects from '@renderer/pages/Projects'
import BlockEditor from '@renderer/pages/BlockEditor'
import Patients from '@renderer/pages/Patients'

export default function Router(): ReactElement {
  const location = useLocation()
  const [showNavbar, setShowNavbar] = useState(false)
  const [theme, setTheme] = useState(DEFAULT_THEME)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    setShowNavbar(
      location.pathname !== '/login' &&
        location.pathname !== '/register' &&
        location.pathname !== '/registerPatient'
    )
  }, [location])

  return (
    <AuthProvider>
      <ToastContainer />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/register-patient" element={<Patients />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/editor" element={<BlockEditor />} />
      </Routes>
    </AuthProvider>
  )
}
