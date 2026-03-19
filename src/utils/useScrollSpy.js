import { useEffect } from 'react'

/**
 * Custom hook for scroll spy functionality using IntersectionObserver
 * @param {Function} setActiveDate - Callback to set the active date
 * @param {string} selector - CSS selector for elements to observe (default: '[id^="date-"]')
 * @returns {void}
 */
export const useScrollSpy = (setActiveDate, selector = '[id^="date-"]') => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Filter entries that are intersecting
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          // Find the entry that's closest to the top of the viewport
          // This is the one with the smallest boundingClientRect.top value
          const topmostEntry = visibleEntries.reduce((topmost, current) => {
            const topmostTop = topmost.boundingClientRect.top
            const currentTop = current.boundingClientRect.top
            return currentTop < topmostTop ? current : topmost
          })

          // Extract date from id="date-{date}"
          const dateId = topmostEntry.target.id.replace('date-', '')
          setActiveDate(dateId)
        }
      },
      {
        root: null, // viewport
        rootMargin: '-100px 0px -40% 0px', // Detection zone: below navbar to 60% of viewport
        threshold: 0.01, // Require just 1% of card to be visible (very sensitive)
      }
    )

    // Observe all date sections
    const dateSections = document.querySelectorAll(selector)
    dateSections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [setActiveDate, selector])
}
