import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TutorialContext = createContext()

export const useTutorial = () => {
  return useContext(TutorialContext)
}

export const TutorialProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false)
  const [steps, setSteps] = useState([])
  const location = useLocation()

  // Tutorial steps for different pages
  const tutorialSteps = {
    '/': [
      {
        target: '.dashboard-stats',
        content: 'Welcome to your dashboard! Here you can see an overview of your finances.',
        disableBeacon: true,
      },
      {
        target: '.recent-projects',
        content: 'Track your ongoing projects and their status here.',
      },
      {
        target: '.recent-expenses',
        content: 'Monitor your recent expenses and spending patterns.',
      },
    ],
    '/projects': [
      {
        target: '.add-project-btn',
        content: 'Click here to add a new project and start tracking your work.',
        disableBeacon: true,
      },
      {
        target: '.project-list',
        content: 'View and manage all your projects in one place.',
      },
    ],
    '/expenses': [
      {
        target: '.add-expense-btn',
        content: 'Add new expenses by clicking here.',
        disableBeacon: true,
      },
      {
        target: '.expense-filters',
        content: 'Filter and search through your expenses easily.',
      },
    ],
    '/accounts': [
      {
        target: '.add-account-btn',
        content: 'Add your bank accounts and track your balances.',
        disableBeacon: true,
      },
      {
        target: '.accounts-summary',
        content: 'View your total assets, liabilities, and net worth.',
      },
    ],
  }

  // Update steps when location changes
  useEffect(() => {
    setSteps(tutorialSteps[location.pathname] || [])
  }, [location.pathname])

  const startTutorial = () => {
    setShowTutorial(true)
  }

  const endTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem('tutorialCompleted', 'true')
  }

  const value = {
    showTutorial,
    steps,
    startTutorial,
    endTutorial,
  }

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}