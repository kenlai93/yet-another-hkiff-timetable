import React, { useCallback, useMemo } from 'react'
import {
  HKIFF_DOMAIN,
  EARLIEST_MINUTES,
  LATEST_MINUTES,
} from '../utils/constants.js'
import { SCREENING_DATA } from '../data/index.js'
import { timeToMinutes } from '../utils/dateUtils.js'
import { useScrollToHighlight } from '../utils/useScrollToHighlight.js'

export const ScreeningBlock = React.memo(({
  screeningInfo,
  isSelected,
  isDisabled,
  allSelectedScreeningIds = [],
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

  const toggleSelect = useCallback((e) => {
    e.stopPropagation()
    if (!isDisabled) {
      onToggleSelect(screeningInfo.sid)
    }
  }, [isDisabled, onToggleSelect, screeningInfo.sid])

  const otherScreenings = useMemo(
    () =>
      SCREENING_DATA.screenings.filter(
        (s) => s.fid === screeningInfo.fid && s.sid !== screeningInfo.sid
      ),
    [screeningInfo.fid, screeningInfo.sid]
  )

  const hasOtherScreeningSelected = useMemo(
    () =>
      !isSelected &&
      otherScreenings.some((s) => allSelectedScreeningIds.includes(s.sid)),
    [isSelected, otherScreenings, allSelectedScreeningIds]
  )

  const handleJumpToOtherScreening = useCallback((e) => {
    e.stopPropagation()
    if (otherScreenings.length > 0) {
      scrollToHighlight(otherScreenings[0].sid)
    }
  }, [otherScreenings, scrollToHighlight])

  const handleGoDetailPage = useCallback((e) => {
    e.stopPropagation()
    window.open(
      `${HKIFF_DOMAIN}/film/getdetail?fid=${screeningInfo.fid}`,
      '_blank'
    )
  }, [screeningInfo.fid])

  const renderStatusIcon = () => {
    if (isSelected) return <i className="bi bi-check2-circle me-1" />
    if (isDisabled) return <i className="bi bi-ban me-1" />
    if (hasOtherScreeningSelected)
      return (
        <i
          className="bi bi-check-circle-fill me-1 text-success"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Another screening of this film is selected"
        />
      )
    return <i className="bi bi-circle me-1 text-muted" />
  }

  return (
    <div
      id={`screening-${screeningInfo.sid}`}
      className={`screening-block ${isSelected ? 'selected' : ''} ${
        isDisabled ? 'disabled' : ''
      } p-3 d-flex flex-column`}
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
        {screeningInfo.sid}｜{screeningInfo.director}
      </div>
      <div className="screening-helper-text">{screeningInfo.subCat}</div>
      <div className="screening-helper-text">
        {screeningInfo.startTime} - {screeningInfo.endTime} (
        {screeningInfo.durationMinutes}mins)
      </div>

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
          {otherScreenings.length > 1
            ? `${otherScreenings.length} more`
            : '1 more'}
          <i className="bi bi-arrow-right ms-1"></i>
        </button>
      ) : (
        <button
          type="button"
          className="screening-block-info-btn btn btn-sm w-100 text-start btn-outline-warning mt-auto"
        >
          <i className="bi bi-exclamation-triangle me-1"></i>
          The only screening
        </button>
      )}
    </div>
  )
})
