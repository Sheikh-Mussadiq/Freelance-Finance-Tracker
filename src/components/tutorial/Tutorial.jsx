import { useEffect } from 'react'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { useTutorial } from '../../context/TutorialContext'

const Tutorial = () => {
  const { showTutorial, steps, endTutorial } = useTutorial()

  const handleCallback = (data) => {
    const { action, status } = data

    if (
      action === ACTIONS.CLOSE ||
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED
    ) {
      endTutorial()
    }
  }

  return (
    <Joyride
      callback={handleCallback}
      continuous
      hideCloseButton
      hideBackButton
      showProgress
      showSkipButton
      run={showTutorial}
      steps={steps}
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