import React, { useMemo } from 'react'
import {
  HKIFF_DOMAIN,
  EARLIEST_MINUTES,
  LATEST_MINUTES,
} from '../utils/constants.js'
import { SCREENING_DATA } from '../data/index.js'
import { timeToMinutes } from '../utils/dateUtils.js'
import { useScrollToHighlight } from '../utils/useScrollToHighlight.js'

export const ScreeningBlock = ({
  screeningInfo,
  isSelected,
  isDisabled,
  onToggleSelect,
}) => {
  const scrollToHighlight = useScrollToHighlight()
  const startMinutes = timeToMinutes(screeningInfo.startTime)
  const endMinutes = timeToMinutes(screeningInfo.endTime)

  // Calculate grid column positions (1-indexed)
  const startColumn = startMinutes - EARLIEST_MINUTES + 1
  // Trim blocks that extend past the grid boundary
  const endColumn = Math.min(
    endMinutes - EARLIEST_MINUTES + 1,
    LATEST_MINUTES - EARLIEST_MINUTES + 1
  )

  const toggleSelect = (e) => {
    e.stopPropagation()
    if (!isDisabled) {
      onToggleSelect(screeningInfo.sid)
    }
  }

  const otherScreenings = useMemo(
    () =>
      SCREENING_DATA.screenings.filter(
        (s) => s.fid === screeningInfo.fid && s.sid !== screeningInfo.sid
      ),
    [screeningInfo.fid, screeningInfo.sid]
  )

  const handleJumpToOtherScreening = (e) => {
    e.stopPropagation()
    if (otherScreenings.length > 0) {
      scrollToHighlight(otherScreenings[0].sid)
    }
  }

  const handleGoDetailPage = (e) => {
    e.stopPropagation()
    window.open(
      `${HKIFF_DOMAIN}/film/getdetail?fid=${screeningInfo.fid}`,
      '_blank'
    )
  }

  const renderStatusIcon = () => {
    if (isSelected) return <i className="bi bi-check2-circle me-1" />
    if (isDisabled) return <i className="bi bi-ban me-1" />
    return <i className="bi bi-circle me-1 text-muted" />
  }

  return (
    <div
      id={`screening-${screeningInfo.sid}`}
      className={`screening-block ${isSelected ? 'selected' : ''} ${
        isDisabled ? 'disabled' : ''
      } p-2 d-flex flex-column`}
      style={{
        gridColumnStart: startColumn,
        gridColumnEnd: endColumn,
      }}
      onClick={toggleSelect}
    >
      <div className="d-flex align-items-start justify-content-between gap-1 mb-1">
        <div className="screening-title fw-bold">
          {renderStatusIcon()}
          {screeningInfo.title}
        </div>
        <button
          type="button"
          className="screening-block-info-btn btn btn-sm btn-outline-info text-nowrap"
          onClick={handleGoDetailPage}
          aria-label="go-to-detail-page"
        >
          <i className="bi bi-box-arrow-up-right" />
        </button>
      </div>

      <div className="screening-helper-text">
        {screeningInfo.director} {screeningInfo.sid}
      </div>
      <div className="screening-helper-text">
        {screeningInfo.startTime} - {screeningInfo.endTime} (
        {screeningInfo.durationMinutes}mins)
      </div>
      <div className="screening-helper-text">{screeningInfo.subCat}</div>

      {otherScreenings.length > 0 ? (
        <button
          type="button"
          className="screening-block-info-btn btn btn-sm w-100 text-start btn-outline-info mt-auto"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          data-bs-html="true"
          data-bs-title={otherScreenings
            .map((s) => `${s.date} ${s.startTime} ${s.locationId}`)
            .join('<br/>')}
          onClick={handleJumpToOtherScreening}
        >
          <i className="bi bi-calendar-check me-1"></i>
          {otherScreenings.length > 1 ? `${otherScreenings.length} more` : '1 more'}
          <i className="bi bi-arrow-right ms-1"></i>
        </button>
      ) : (
        <button
          type="button"
          className="screening-block-info-btn btn btn-sm w-100 text-start btn-outline-warning mt-auto"
        >
          ⚠️ The only screening
        </button>
      )}
    </div>
  )
}
