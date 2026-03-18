import React, { useState } from 'react'
import { formatShortDate } from '../utils/dateUtils.js'
import { exportToCSV, exportToICS } from '../utils/exportUtils.js'
import { useScrollToHighlight } from '../utils/useScrollToHighlight.js'

export const DateNavigator = ({
  dates,
  activeDate,
  selectedScreenings,
  onClearAll,
  onToggleScreening,
}) => {
  const [showDrawer, setShowDrawer] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const scrollToHighlight = useScrollToHighlight()

  const toggleDrawer = () => setShowDrawer(!showDrawer)

  const totalSelected = selectedScreenings.length

  const handleExportToCSV = () => {
    exportToCSV(selectedScreenings, () => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  const handleExportToICS = () => {
    exportToICS(selectedScreenings)
  }

  const handleClearAll = (e) => {
    e.preventDefault()
    if (confirm('This will clear all your selected screenings. Continue?')) {
      localStorage.removeItem('selected-screenings')
      onClearAll()
    }
  }

  const handleScrollToScreening = (screeningId) => {
    scrollToHighlight(screeningId)
    setShowDrawer(false)
  }

  const handleRemoveScreening = (e, screeningId, date) => {
    e.stopPropagation()
    onToggleScreening(screeningId, date)
  }

  // Group screenings by date
  const screeningsByDate = selectedScreenings.reduce((acc, screening) => {
    if (!acc[screening.date]) {
      acc[screening.date] = []
    }
    acc[screening.date].push(screening)
    return acc
  }, {})

  const sortedDates = Object.keys(screeningsByDate).sort()

  return (
    <>
      <nav
        id="dateNavbar"
        className="navbar navbar-expand navbar-light bg-light sticky-top mb-4"
      >
        <div className="container-fluid">
          <span className="navbar-brand">HKIFF50 Timetable</span>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {dates.map((date) => (
                <li className="nav-item" key={date}>
                  <a
                    className={`nav-link ${
                      activeDate === date ? 'active' : ''
                    }`}
                    href={`#date-${date}`}
                  >
                    {formatShortDate(date)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="ms-auto d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary position-relative"
                onClick={toggleDrawer}
              >
                <i className="bi bi-list-check me-1"></i>
                My Selections
                {totalSelected > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                    {totalSelected}
                  </span>
                )}
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleClearAll}
              >
                <i className="bi bi-trash me-1"></i>
                Clear all
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Offcanvas Drawer */}
      <div
        className={`offcanvas offcanvas-end ${showDrawer ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: showDrawer ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header">
          <div>
            <h5 className="offcanvas-title mb-0">My Selections ({totalSelected})</h5>
            <small className="text-muted">Click any item to view on timetable</small>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={toggleDrawer}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          {selectedScreenings.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">No screenings selected yet</p>
            </div>
          ) : (
            <>
              <div
                className="h-100"
                style={{ paddingBottom: '80px' }}
              >
                {sortedDates.map((date) => (
                  <div key={date} className="mb-3">
                    <div className="px-3 py-2 bg-light border-bottom sticky-top" style={{ top: 0 }}>
                      <strong>
                        {formatShortDate(date)}
                        <span className="badge bg-info ms-2">
                          {screeningsByDate[date].length}
                        </span>
                      </strong>
                    </div>
                    <div className="list-group list-group-flush">
                      {screeningsByDate[date].map((screening) => (
                        <div
                          key={screening.sid}
                          className="list-group-item list-group-item-action"
                        >
                          <div
                            onClick={() => handleScrollToScreening(screening.sid)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex w-100 justify-content-between align-items-start">
                              <h6 className="mb-1">
                                {screening.title}
                              </h6>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) =>
                                  handleRemoveScreening(
                                    e,
                                    screening.sid,
                                    screening.date
                                  )
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                            <small className="text-muted">
                              <i className="bi bi-geo-alt mx-1"></i>
                              {screening.locationId}
                              <i className="bi bi-clock mx-1"></i>
                              {screening.startTime} - {screening.endTime} (
                              {screening.durationMinutes}min)
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticky Footer with Export Buttons */}
              <div className="drawer-footer">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleExportToCSV}
                  >
                    <i className="bi bi-clipboard-check me-2"></i>
                    {copySuccess
                      ? 'Copied!'
                      : 'Export to CSV (Copy to Clipboard)'}
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={handleExportToICS}
                  >
                    <i className="bi bi-calendar-plus me-2"></i>
                    Export to Calendar (ICS)
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {showDrawer && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={toggleDrawer}
        ></div>
      )}
    </>
  )
}
