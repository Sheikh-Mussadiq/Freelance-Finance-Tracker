import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { TutorialProvider } from './context/TutorialContext'
import Layout from './components/layout/Layout'
import Tutorial from './components/tutorial/Tutorial'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Expenses from './pages/Expenses'
import Accounts from './pages/Accounts'
import Settings from './pages/Settings'
import { DataProvider } from './context/DataContext'
import './App.css'

const ProtectedLayout = ({ darkMode, toggleDarkMode }) => {
  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Outlet />
    </Layout>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for user preference or system preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setDarkMode(isDarkMode)
  }, [])

  useEffect(() => {
    // Update class on document when dark mode changes
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <TutorialProvider>
            <Tutorial />
            <AnimatePresence mode="wait">
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </TutorialProvider>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App