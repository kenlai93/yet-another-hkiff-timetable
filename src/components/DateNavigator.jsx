import React, { useState } from 'react'
import { formatShortDate } from '../utils/dateUtils.js'
import { exportToCSV, exportToICS } from '../utils/exportUtils.js'
import { useScrollToHighlight } from '../utils/useScrollToHighlight.js'

export const DateNavigator = ({
  dates,
  activeDate,
  screeningCounts,
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

  return (
    <>
      <nav
        id="dateNavbar"
        className="navbar navbar-expand-lg navbar-light bg-light sticky-top mb-4"
      >
        <div className="container-fluid">
          <span className="navbar-brand">HKIFF50 Timetable</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
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
                    <div className="d-flex align-items-center ">
                      <span className="">{formatShortDate(date)}</span>
                      <span className="badge bg-info ms-1">
                        {screeningCounts[date] || 0}
                      </span>
                    </div>
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
          <h5 className="offcanvas-title">My Selections ({totalSelected})</h5>
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
                className="list-group h-100 p-2"
                style={{ paddingBottom: '80px' }}
              >
                {selectedScreenings.map((screening) => (
                  <div
                    key={screening.sid}
                    className="list-group-item list-group-item-action"
                  >
                    <div
                      onClick={() => handleScrollToScreening(screening.sid)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex w-100 justify-content-between align-items-start">
                        <h6 className="mb-1">{screening.title}</h6>
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
                        <i className="bi bi-calendar me-1"></i>
                        {formatShortDate(screening.date)}
                        <span className="mx-2">•</span>
                        <i className="bi bi-clock me-1"></i>
                        {screening.startTime} - {screening.endTime} (
                        {screening.durationMinutes}min)
                        <span className="ms-2 badge text-bg-secondary">
                          {screening.locationId}
                        </span>
                      </small>
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
