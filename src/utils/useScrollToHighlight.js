import { useCallback } from 'react'
import { HIGHLIGHT_DURATION_MS } from './constants'

/**
 * Custom hook to scroll to an element and highlight it with a pulse animation
 * @returns {Function} scrollToHighlight - Function that takes an element ID and scrolls/highlights it
 */
export const useScrollToHighlight = () => {
  const scrollToHighlight = useCallback((screeningId) => {
    const targetElement = document.querySelector(`#screening-${screeningId}`)
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      
      // Add highlight class
      targetElement.classList.add('highlight-pulse')
      setTimeout(() => {
        targetElement.classList.remove('highlight-pulse')
      }, HIGHLIGHT_DURATION_MS)
      
      return true
    }
    
    return false
  }, [])

  return scrollToHighlight
}
