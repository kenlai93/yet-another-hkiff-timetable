import React from 'react'
import { formatShortDateWithDay } from '../utils/dateUtils.js'

export const ScreeningListItem = React.memo(({
  screening,
  onClick,
  showDirector = false,
  showDate = false,
  showSubCat = false,
  actionButton = null,
}) => {
  return (
    <div
      className="list-group-item list-group-item-action"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center gap-3">
        <div className="flex-fill">
          <h6 className="mb-1">
            {screening.sid}｜{screening.title}
          </h6>
          {(showDirector || showSubCat) && (
            <div className="d-flex justify-content-start align-middle">
              {showDirector && (
                <small className="text-muted d-block">
                  <i className="bi bi-person me-1"></i>
                  {screening.director}
                </small>
              )}
              {showSubCat && (
                <small
                  className={`text-muted d-block ${showDirector ? 'ms-2' : ''}`}
                >
                  <i className="bi bi-tag me-1"></i>
                  {screening.subCat}
                </small>
              )}
            </div>
          )}
          <small className="text-muted">
            {showDate && (
              <>
                <i className="bi bi-calendar mx-1"></i>
                {formatShortDateWithDay(screening.date)}
              </>
            )}
            <i className="bi bi-geo-alt mx-1"></i>
            {screening.locationId}
            <i className="bi bi-clock ms-2 mx-1"></i>
            {screening.startTime} - {screening.endTime} ({screening.durationMinutes}
            min)
          </small>
        </div>
        {actionButton && (
          <div className="flex-shrink-0">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  )
})
