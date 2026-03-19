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
      // Find the parent collapse element
      const collapseElement = targetElement.closest('.collapse')
      
      if (collapseElement) {
        // Check if the collapse is not shown
        if (!collapseElement.classList.contains('show')) {
          // Get Bootstrap Collapse instance or create one
          const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(collapseElement)
          // Show the collapse
          bsCollapse.show()
          
          // Wait for collapse animation to finish before scrolling
          collapseElement.addEventListener('shown.bs.collapse', () => {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
            
            // Add highlight class
            targetElement.classList.add('highlight-pulse')
            setTimeout(() => {
              targetElement.classList.remove('highlight-pulse')
            }, HIGHLIGHT_DURATION_MS)
          }, { once: true })
        } else {
          // Already shown, scroll immediately
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
          
          // Add highlight class
          targetElement.classList.add('highlight-pulse')
          setTimeout(() => {
            targetElement.classList.remove('highlight-pulse')
          }, HIGHLIGHT_DURATION_MS)
        }
      } else {
        // No parent collapse, scroll immediately
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        
        // Add highlight class
        targetElement.classList.add('highlight-pulse')
        setTimeout(() => {
          targetElement.classList.remove('highlight-pulse')
        }, HIGHLIGHT_DURATION_MS)
      }
      
      return true
    }
    
    return false
  }, [])

  return scrollToHighlight
}
