import { useEffect, useMemo, useState } from 'react'
import { DateNavigator } from './components/DateNavigator.jsx'
import { Timetable } from './components/Timetable.jsx'
import { SCREENING_DATA } from './data/index.js'
import { initializeTooltips, timeToMinutes } from './utils/dateUtils.js'
import { useScrollSpy } from './utils/useScrollSpy.js'
import { useStoredScreenings } from './utils/useStoredScreenings.js'

const availableDates = [
  ...new Set(SCREENING_DATA.screenings.map((screening) => screening.date)),
]

export const App = () => {
  const [activeDate, setActiveDate] = useState(availableDates[0])

  // Store selected screening IDs in localStorage
  const [selectedScreeningIdsByDateMap, setSelectedScreeningIdsByDateMap] =
    useStoredScreenings(availableDates)

  // Derive occupied times from selected screening IDs
  const occupiedTimesByDateMap = useMemo(() => {
    const result = {}
    Object.entries(selectedScreeningIdsByDateMap).forEach(
      ([date, screeningIds]) => {
        result[date] = screeningIds
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
      }
    )
    return result
  }, [selectedScreeningIdsByDateMap])

  // Initialize tooltips on mount for static elements
  useEffect(() => {
    const tooltipList = initializeTooltips()

    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose())
    }
  }, [])

  // Native scroll spy using IntersectionObserver
  useScrollSpy(setActiveDate)

  const handleToggleScreening = (screeningId, date) => {
    setSelectedScreeningIdsByDateMap((prevMap) => {
      const currentIds = prevMap[date] || []
      const isSelected = currentIds.includes(screeningId)

      const updatedIds = isSelected
        ? currentIds.filter((id) => id !== screeningId)
        : [...currentIds, screeningId]

      return {
        ...prevMap,
        [date]: updatedIds,
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

  // Get all selected screening IDs across all dates
  const allSelectedScreeningIds = useMemo(
    () => Object.values(selectedScreeningIdsByDateMap).flat(),
    [selectedScreeningIdsByDateMap]
  )

  const handleClearAll = () => {
    setSelectedScreeningIdsByDateMap(
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
            allSelectedScreeningIds={allSelectedScreeningIds}
            onToggleScreening={handleToggleScreening}
          />
        ))}
      </div>
    </div>
  )
}
