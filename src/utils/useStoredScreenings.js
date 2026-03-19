import { useState, useEffect } from 'react'

/**
 * Custom hook for managing selected screenings stored in localStorage
 * @param {string[]} availableDates - Array of all available dates
 * @returns {[Object, Function]} - [selectedScreeningIdsByDateMap, setSelectedScreeningIdsByDateMap]
 */
export const useStoredScreenings = (availableDates) => {
  const [value, setValue] = useState(() => {
    const savedData = localStorage.getItem('selected-screenings')

    if (savedData) {
      try {
        return JSON.parse(savedData)
      } catch (error) {
        console.error('Error parsing localStorage key "selected-screenings":', error)
      }
    }

    // Default: empty arrays for all dates
    return availableDates.reduce(
      (acc, date) => ({
        ...acc,
        [date]: [],
      }),
      {}
    )
  })

  useEffect(() => {
    localStorage.setItem('selected-screenings', JSON.stringify(value))
  }, [value])

  return [value, setValue]
}
