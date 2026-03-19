import React, { useState, useMemo, useCallback } from 'react'
import debounce from 'lodash.debounce'
import { formatShortDate, formatShortDateWithDay } from '../utils/dateUtils.js'
import { exportToCSV, exportToICS } from '../utils/exportUtils.js'
import { useScrollToHighlight } from '../utils/useScrollToHighlight.js'
import { SCREENING_DATA } from '../data/index.js'
import { ScreeningListItem } from './ScreeningListItem.jsx'
import dayjs from 'dayjs'

export const DateNavigator = ({
  dates,
  activeDate,
  selectedScreenings,
  onClearAll,
  onToggleScreening,
}) => {
  const [showDrawer, setShowDrawer] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const scrollToHighlight = useScrollToHighlight()

  const toggleDrawer = () => setShowDrawer(!showDrawer)

  const totalSelected = selectedScreenings.length

  // Create debounced function to update search query
  const debouncedSetSearchQuery = useCallback(
    debounce((value) => {
      setDebouncedSearchQuery(value)
    }, 300),
    []
  )

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSetSearchQuery(value)
  }

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

  const handleSearch = () => {
    setShowSearchModal(true)
  }

  const handleSearchResultClick = (screeningId) => {
    scrollToHighlight(screeningId)
    setShowSearchModal(false)
    setSearchQuery('')
  }

  // Filter screenings based on search query (title, director, subCat only)
  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return []

    const query = debouncedSearchQuery.toLowerCase()
    return SCREENING_DATA.screenings.filter((screening) => {
      return (
        screening.title.toLowerCase().includes(query) ||
        screening.sid.toLowerCase().includes(query) ||
        screening.director.toLowerCase().includes(query) ||
        screening.subCat.toLowerCase().includes(query)
      )
    })
  }, [debouncedSearchQuery])

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
        style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="container-fluid">
          <span className="navbar-brand">HKIFF50 Timetable</span>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {dates.map((date) => (
                <li className="nav-item" key={date}>
                  <a
                    className={`nav-link mx-3 d-flex flex-column align-items-center ${
                      activeDate === date ? 'active' : ''
                    }`}
                    href={`#date-${date}`}
                    style={{ lineHeight: '1.2' }}
                  >
                    <span>{formatShortDate(date)}</span>
                    <small style={{ fontSize: '0.75rem' }}>{dayjs(date).format('ddd')}</small>
                  </a>
                </li>
              ))}
            </ul>
            <div className="ms-auto d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleSearch}
              >
                <i className="bi bi-search"></i>
              </button>
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
            <h5 className="offcanvas-title mb-0">
              My Selections ({totalSelected})
            </h5>
            <small className="text-muted">
              Click any item to view on timetable
            </small>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={toggleDrawer}
          ></button>
        </div>
        <div className="offcanvas-body p-0 d-flex flex-column">
          {selectedScreenings.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">No screenings selected yet</p>
            </div>
          ) : (
            <>
              <div className="flex-grow-1 overflow-auto">
                {sortedDates.map((date) => (
                  <div key={date} className="mb-3">
                    <div
                      className="px-3 py-2 bg-light border-bottom sticky-top"
                      style={{ top: 0 }}
                    >
                      <strong>
                        {formatShortDateWithDay(date)}
                        <span className="badge bg-info ms-2">
                          {screeningsByDate[date].length}
                        </span>
                      </strong>
                    </div>
                    <div className="list-group list-group-flush">
                      {screeningsByDate[date].map((screening) => (
                        <ScreeningListItem
                          key={screening.sid}
                          screening={screening}
                          onClick={() => handleScrollToScreening(screening.sid)}
                          actionButton={
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
                          }
                        />
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

      {/* Search Modal */}
      <div
        className={`modal fade ${showSearchModal ? 'show' : ''}`}
        style={{ display: showSearchModal ? 'block' : 'none' }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Search Screenings</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowSearchModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, code, director, or category..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  autoFocus
                />
              </div>
              {searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div className="list-group">
                    {searchResults.map((screening) => (
                      <ScreeningListItem
                        key={screening.sid}
                        screening={screening}
                        onClick={() => handleSearchResultClick(screening.sid)}
                        showDirector={true}
                        showDate={true}
                        showSubCat={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i
                      className="bi bi-search"
                      style={{ fontSize: '2rem' }}
                    ></i>
                    <p className="mt-2">No screenings found</p>
                  </div>
                )
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-search" style={{ fontSize: '2rem' }}></i>
                  <p className="mt-2">Start typing to search...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal Backdrop */}
      {showSearchModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => setShowSearchModal(false)}
        ></div>
      )}
    </>
  )
}
