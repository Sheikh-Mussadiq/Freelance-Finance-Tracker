import { useEffect, useState, useRef } from 'react'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { useTutorial } from '../../context/TutorialContext'
import { useAuth } from '../../context/AuthContext'

const Tutorial = () => {
  const { showTutorial, steps, endTutorial, isNewUser } = useTutorial()
  const { user } = useAuth()
  const [stepIndex, setStepIndex] = useState(0)
  const joyrideRef = useRef(null)

  const handleCallback = (data) => {
    const { action, status, type, index } = data
    
    // Log all tutorial events for debugging
    console.log('Tutorial event:', { action, status, type, index, stepIndex })
    
    // Handle different event types
    switch (type) {
      case EVENTS.STEP_AFTER:
        // Move to the next step only if we're not at the last step
        if (index < steps.length - 1) {
          setStepIndex(index + 1)
        }
        break
        
      case EVENTS.TARGET_NOT_FOUND:
        console.warn(`Tutorial target not found for step ${index}:`, steps[index])
        break
        
      case EVENTS.TOUR_END:
        // Only end the tutorial when it's explicitly finished or skipped
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
          console.log('Tutorial completed or skipped, ending tutorial')
          endTutorial()
          setStepIndex(0)
        }
        break
        
      default:
        break
    }
    
    // Prevent the tutorial from ending when clicking next
    if (action === ACTIONS.NEXT && status === STATUS.RUNNING) {
      console.log('Next button clicked, continuing tutorial')
      // Don't end the tutorial here
    }
  }
  
  // Debug info for tutorial state
  useEffect(() => {
    if (user) {
      console.log('Tutorial state:', { 
        user: user.id, 
        isNewUser, 
        showTutorial, 
        stepsCount: steps.length,
        currentStep: stepIndex,
        path: window.location.pathname
      })
    }
  }, [user, isNewUser, showTutorial, steps, stepIndex])
  
  // Ensure DOM elements are ready before showing tutorial
  useEffect(() => {
    if (showTutorial && steps.length > 0) {
      // Small delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        // Check if target elements exist
        const targetsStatus = steps.map(step => {
          const target = document.querySelector(step.target)
          return { target: step.target, exists: !!target }
        })
        
        const allTargetsExist = targetsStatus.every(status => status.exists)
        
        if (!allTargetsExist) {
          console.warn('Some tutorial target elements not found:', targetsStatus)
        } else {
          console.log('All tutorial targets found:', targetsStatus)
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [showTutorial, steps])

  return (
    <Joyride
      ref={joyrideRef}
      callback={handleCallback}
      continuous={true}
      disableCloseOnEsc={false}
      disableOverlayClose={true}
      hideCloseButton={true}
      hideBackButton={false}
      showProgress={true}
      showSkipButton={true}
      spotlightClicks={false}
      run={showTutorial && steps.length > 0}
      steps={steps}
      stepIndex={stepIndex}
      disableOverlay={false}
      debug={true}
      locale={{
        last: 'Finish',
        next: 'Next',
        skip: 'Skip',
        back: 'Back'
      }}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          primaryColor: '#0ea5e9',
          textColor: '#333',
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: '8px',
          fontSize: '14px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#0ea5e9',
          fontSize: '14px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#666',
          marginRight: '8px',
        },
        buttonSkip: {
          color: '#666',
        },
      }}
    />
  )
}

export default Tutorial