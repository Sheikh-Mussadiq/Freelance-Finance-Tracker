import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const TutorialContext = createContext()

export const useTutorial = () => {
  return useContext(TutorialContext)
}

export const TutorialProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false)
  const [steps, setSteps] = useState([])
  const location = useLocation()
  const [isNewUser, setIsNewUser] = useState(false)
  const { user } = useAuth()

  // Tutorial steps for different pages
  const tutorialSteps = {
    '/': [
      {
        target: '.dashboard-stats',
        content: 'Welcome to your dashboard! Here you can see an overview of your finances at a glance.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.total-income',
        content: 'This shows your total income across all projects. Track how much you\'ve earned over time.',
        placement: 'bottom',
      },
      {
        target: '.total-expenses',
        content: 'Monitor your total expenses here. Keep an eye on your spending to stay within budget.',
        placement: 'bottom',
      },
      {
        target: '.net-profit',
        content: 'Your net profit shows how much you\'re actually earning after expenses. This is a key metric for financial health.',
        placement: 'bottom',
      },
      {
        target: '.recent-projects',
        content: 'Track your ongoing projects and their status here. Click on any project to see more details.',
        placement: 'top',
      },
      {
        target: '.project-status-chart',
        content: 'This chart shows the distribution of your projects by status. It helps you visualize your workload.',
        placement: 'left',
      },
      {
        target: '.recent-expenses',
        content: 'Monitor your recent expenses and spending patterns. Categorized expenses help you understand where your money is going.',
        placement: 'top',
      },
      {
        target: '.expense-category-chart',
        content: 'This breakdown shows your expenses by category. Identify which areas are consuming most of your budget.',
        placement: 'left',
      },
      {
        target: '.monthly-summary',
        content: 'View your monthly financial summary to track trends over time and plan for the future.',
        placement: 'bottom',
      },
    ],
    '/projects': [
      {
        target: '.add-project-btn',
        content: 'Click here to add a new project and start tracking your work. Adding detailed project information helps with better financial management.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.project-filters',
        content: 'Use these filters to quickly find specific projects by status, client, or date range.',
        placement: 'bottom',
      },
      {
        target: '.project-search',
        content: 'Search for specific projects by name, client, or any other keyword associated with your projects.',
        placement: 'bottom',
      },
      {
        target: '.project-list',
        content: 'View and manage all your projects in one place. Click on any project to see details or edit information.',
        placement: 'top',
      },
      {
        target: '.project-status-indicator',
        content: 'These indicators show the current status of each project. You can sort projects by status to prioritize your work.',
        placement: 'right',
      },
      {
        target: '.project-actions',
        content: 'Use these action buttons to quickly edit, delete, or mark a project as complete.',
        placement: 'left',
      },
      {
        target: '.project-summary',
        content: 'The summary section shows key metrics across all your projects, helping you understand your overall workload and earnings.',
        placement: 'bottom',
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

  // Check if user is new and set up tutorial when user logs in
  useEffect(() => {
    if (user) {
      // Use a user-specific key to track tutorial completion
      const userKey = `tutorialCompleted_${user.id}`
      const tutorialCompleted = localStorage.getItem(userKey)
      
      if (tutorialCompleted !== 'true') {
        console.log('New user detected, should show tutorial')
        setIsNewUser(true)
        
        // Only show tutorial on main pages
        if (location.pathname === '/' || 
            location.pathname === '/projects' || 
            location.pathname === '/expenses' || 
            location.pathname === '/accounts') {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            setShowTutorial(true)
            console.log('Starting tutorial for new user')
          }, 500)
        }
      } else {
        console.log('Returning user, tutorial already completed')
        setIsNewUser(false)
      }
    }
  }, [user, location.pathname])

  // Update steps when location changes
  useEffect(() => {
    const pageSteps = tutorialSteps[location.pathname] || []
    
    // Only update steps if we have steps for this page
    if (pageSteps.length > 0) {
      setSteps(pageSteps)
      
      // Start tutorial for new users when they navigate to a page with tutorial steps
      if (isNewUser) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          setShowTutorial(true)
          console.log('Starting tutorial for new user on page:', location.pathname)
        }, 300)
      }
    } else {
      // No steps for this page
      setSteps([])
    }
  }, [location.pathname, isNewUser])

  const startTutorial = () => {
    setShowTutorial(true)
  }

  const endTutorial = () => {
    setShowTutorial(false)
    setIsNewUser(false)
    
    // Save tutorial completion status with user ID if available
    if (user) {
      const userKey = `tutorialCompleted_${user.id}`
      localStorage.setItem(userKey, 'true')
      console.log(`Tutorial completed and marked as done for user ${user.id}`)
    } else {
      // Fallback for when user context isn't available
      localStorage.setItem('tutorialCompleted', 'true')
      console.log('Tutorial completed and marked as done (no user ID)')
    }
  }

  const value = {
    showTutorial,
    steps,
    startTutorial,
    endTutorial,
    isNewUser,
  }

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  )
}