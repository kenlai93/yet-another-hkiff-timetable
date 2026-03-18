import { useEffect, useMemo, useState } from 'react'
import { DateNavigator } from './components/DateNavigator.jsx'
import { Timetable } from './components/Timetable.jsx'
import { SCREENING_DATA } from './data/index.js'
import { initializeTooltips, timeToMinutes } from './utils/dateUtils.js'

const availableDates = [
  ...new Set(SCREENING_DATA.screenings.map((screening) => screening.date)),
]

export const App = () => {
  const [activeDate, setActiveDate] = useState(availableDates[0])

  // Initialize state with restored data from localStorage or empty arrays
  const [occupiedTimesByDateMap, setOccupiedTimesByDateMap] = useState(() => {
    // Try to restore from localStorage
    const savedData = localStorage.getItem('selected-screenings')

    if (savedData) {
      try {
        const savedSelections = JSON.parse(savedData)
        const restoredOccupiedTimes = {}

        Object.entries(savedSelections).forEach(([date, screeningIds]) => {
          restoredOccupiedTimes[date] = screeningIds
            .map((sid) => {
              const screening = SCREENING_DATA.screenings.find(
                (s) => s.sid === sid
              )
              if (!screening) return null
              return {
                occupiedBy: sid,
                startTime: screening.startTime,
                endTime: screening.endTime,
              }
            })
            .filter(Boolean) // Remove nulls
        })

        return restoredOccupiedTimes
      } catch (error) {
        console.error('Error restoring selections from localStorage:', error)
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

  // Derive selected screening IDs from occupied times
  const selectedScreeningIdsByDateMap = useMemo(() => {
    const result = {}
    Object.keys(occupiedTimesByDateMap).forEach((date) => {
      result[date] = occupiedTimesByDateMap[date].map((o) => o.occupiedBy)
    })
    return result
  }, [occupiedTimesByDateMap])

  // Save selections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'selected-screenings',
      JSON.stringify(selectedScreeningIdsByDateMap)
    )
  }, [selectedScreeningIdsByDateMap])

  // Initialize tooltips on mount for static elements
  useEffect(() => {
    const tooltipList = initializeTooltips()

    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose())
    }
  }, [])

  // Native scroll spy using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const topVisibleEntries = entries.find(
          (entry) => entry.isIntersecting && entry.intersectionRatio > 0
        )

        if (topVisibleEntries) {
          // Extract date from id="date-{date}"
          const dateId = topVisibleEntries.target.id.replace('date-', '')

          setActiveDate(dateId)
        } else {
          // Fallback: if no entries are visible and we're near the top, activate first date
          if (window.scrollY < 200) {
            setActiveDate(availableDates[0])
          }
        }
      },
      {
        root: null, // viewport
        rootMargin: '-100px 0px -60% 0px', // Offset for sticky navbar and bias towards top
        threshold: 0,
      }
    )

    // Observe all date sections
    const dateSections = document.querySelectorAll('[id^="date-"]')
    dateSections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleToggleScreening = (screeningId, date) => {
    const selectedScreening = SCREENING_DATA.screenings.find(
      (s) => s.sid === screeningId
    )

    setOccupiedTimesByDateMap((prevMap) => {
      const currentOccupied = prevMap[date] || []
      const isOccupied = currentOccupied.some(
        ({ occupiedBy }) => occupiedBy === screeningId
      )

      const updatedOccupied = isOccupied
        ? currentOccupied.filter((o) => o.occupiedBy !== screeningId)
        : [
            ...currentOccupied,
            {
              occupiedBy: screeningId,
              startTime: selectedScreening.startTime,
              endTime: selectedScreening.endTime,
            },
          ]

      return {
        ...prevMap,
        [date]: updatedOccupied,
      }
    })
  }

  // Get all selected screenings with full data
  const selectedScreenings = useMemo(() => {
    const allSelectedIds = Object.values(selectedScreeningIdsByDateMap).flat()

    return SCREENING_DATA.screenings
      .filter((s) => allSelectedIds.includes(s.sid))
      .sort((a, b) => {
        // Sort by date, then by start time
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
      })
  }, [selectedScreeningIdsByDateMap])

  const handleClearAll = () => {
    setOccupiedTimesByDateMap(
      availableDates.reduce(
        (acc, date) => ({
          ...acc,
          [date]: [],
        }),
        {}
      )
    )
  }
  return (
    <div>
      <DateNavigator
        dates={availableDates}
        activeDate={activeDate}
        selectedScreenings={selectedScreenings}
        onClearAll={handleClearAll}
        onToggleScreening={handleToggleScreening}
      />
      <div className="px-4 pb-4">
        {availableDates.map((date) => (
          <Timetable
            key={date}
            date={date}
            occupiedTimes={occupiedTimesByDateMap[date] || []}
            onToggleScreening={handleToggleScreening}
          />
        ))}
      </div>
    </div>
  )
}
