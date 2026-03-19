import React, { useMemo } from 'react'
import { ScreeningBlock } from './ScreeningBlock.jsx'
import { EARLIEST_MINUTES, LATEST_MINUTES } from '../utils/constants.js'

export const LocationRow = ({
  location,
  screenings,
  occupiedTimes,
  allSelectedScreeningIds = [],
  onToggleScreening,
}) => {
  // Extract selected screening IDs from occupied times (current date only)
  const selectedScreeningIdsForDate = useMemo(
    () => occupiedTimes.map((o) => o.occupiedBy),
    [occupiedTimes]
  )

  // Generate time grid lines (absolute positioned over the grid)
  const timeGridLines = useMemo(() => {
    const startHour = EARLIEST_MINUTES / 60
    const endHour = LATEST_MINUTES / 60
    const totalHours = endHour - startHour

    const lines = []
    for (let i = 0; i <= totalHours; i++) {
      const position = (i / totalHours) * 100
      lines.push(
        <div
          key={`grid-line-${i}`}
          className="time-grid-line"
          style={{ left: `${position}%` }}
        />
      )
    }

    return lines
  }, [])

  return (
    <div className="location-row">
      <div
        className="location-label d-flex align-items-center fw-bold"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        data-bs-title={location.name}
        style={{ cursor: 'help' }}
      >
        {location.id}
        <i className="bi bi-info-circle ms-1 text-muted"></i>
      </div>
      <div className="screenings-track">
        {timeGridLines}
        {screenings.map((screeningInfo) => (
          <ScreeningBlock
            key={screeningInfo.sid}
            screeningInfo={screeningInfo}
            isSelected={Boolean(
              selectedScreeningIdsForDate.includes(screeningInfo.sid)
            )}
            isDisabled={occupiedTimes.some(
              ({ occupiedBy, startTime, endTime }) =>
                // Disable if there's any time conflict (including exact touching times)
                !(
                  occupiedBy === screeningInfo.sid ||
                  screeningInfo.endTime < startTime ||
                  screeningInfo.startTime > endTime
                )
            )}
            allSelectedScreeningIds={allSelectedScreeningIds}
            onToggleSelect={onToggleScreening}
          />
        ))}
      </div>
    </div>
  )
}
