import { useEffect, useMemo } from 'react'
import { SCREENING_DATA } from '../data/index.js'
import {
  EARLIEST_MINUTES,
  LATEST_MINUTES,
  TOTAL_GRID_MINUTES,
} from '../utils/constants.js'
import { formatShortDateWithDay, initializeTooltips } from '../utils/dateUtils.js'
import { findTravelWindows } from '../utils/screeningUtils.js'
import { LocationRow } from './LocationRow.jsx'
import { TimeAxis } from './TimeAxis.jsx'

export const Timetable = ({ date, occupiedTimes, allSelectedScreeningIds = [], onToggleScreening }) => {
  // Filter screenings for the selected date
  const dayScreenings = useMemo(
    () =>
      SCREENING_DATA.screenings.filter((screening) => screening.date === date),
    [date]
  )

  // Group screenings by location
  const screeningsByLocation = useMemo(
    () =>
      SCREENING_DATA.locations.map((location) => ({
        location,
        screenings: dayScreenings.filter(
          (screening) => screening.locationId === location.id
        ),
      })),
    [dayScreenings]
  )

  const collapseId = `collapse-${date}`

  // Compute travel window indicators
  const travelWindows = useMemo(() => {
    // Filter selected screenings for THIS date only
    const selectedScreeningsToday = dayScreenings.filter((s) =>
      occupiedTimes.some((o) => o.occupiedBy === s.sid)
    )

    return findTravelWindows(selectedScreeningsToday, dayScreenings)
  }, [occupiedTimes, dayScreenings])

  // Reinitialize tooltips for dynamic travel-window highlights and status icons
  useEffect(() => {
    const tooltipList = initializeTooltips()

    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose())
    }
  }, [travelWindows, occupiedTimes])

  const handleClearSelection = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Clear all occupied times for this date
    const screeningIds = occupiedTimes.map((o) => o.occupiedBy)
    screeningIds.forEach((sid) => onToggleScreening(sid, date))
  }

  return (
    <>
      <div id={`date-${date}`} className="card my-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <button
            className="btn btn-link text-decoration-none flex-grow-1 text-start d-flex justify-content-between align-items-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${collapseId}`}
            aria-expanded="true"
            aria-controls={collapseId}
          >
            <span>{formatShortDateWithDay(date)}</span>
            <i className="bi bi-chevron-down"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleClearSelection}
          >
            Clear selection
          </button>
        </div>
        <div id={collapseId} className="collapse show">
          <div className="card-body p-4 overflow-hidden">
            <div
              className="timetable-container d-flex flex-column gap-2 mt-4"
              style={{ position: 'relative' }}
            >
              <TimeAxis />
              {/* Vertical highlights for travel time windows */}
              {travelWindows.map((window, index) => {
                const startPercent =
                  ((window.gapStartMinutes - EARLIEST_MINUTES) /
                    TOTAL_GRID_MINUTES) *
                  100
                const endPercent =
                  ((window.gapEndMinutes - EARLIEST_MINUTES) /
                    TOTAL_GRID_MINUTES) *
                  100
                const widthPercent = endPercent - startPercent

                return (
                  <div
                    key={`travel-window-${index}`}
                    className={`travel-window-highlight ${window.isTight ? 'tight' : 'safe'}`}
                    style={{
                      left: `calc(80px + (100% - 80px) * ${startPercent / 100})`,
                      width: `calc((100% - 80px) * ${widthPercent / 100})`,
                    }}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-html="true"
                    data-bs-title={`
                      ${window.isTight ? '<i class="bi bi-exclamation-triangle"></i>' : '<i class="bi bi-check-circle"></i>'}
                      ${window.isTight ? 'Only' : ''} ${window.gapMinutes}min gap between screenings (requires ${window.requiredTravelTime}min travel)
                    `}
                  >
                    <span className="travel-window-badge">
                      {window.isTight ? (
                        <i className="bi bi-exclamation-triangle me-1"></i>
                      ) : (
                        <i className="bi bi-check-circle me-1"></i>
                      )}
                      {window.gapMinutes}min
                    </span>
                  </div>
                )
              })}
              {screeningsByLocation.map(({ location, screenings }) =>
                screenings.length === 0 ? null : (
                  <LocationRow
                    key={location.id}
                    location={location}
                    screenings={screenings}
                    occupiedTimes={occupiedTimes}
                    allSelectedScreeningIds={allSelectedScreeningIds}
                    onToggleScreening={(sid) => onToggleScreening(sid, date)}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
