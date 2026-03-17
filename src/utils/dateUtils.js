import dayjs from 'dayjs'

export const minutesToTime = (minutes) => {
  return dayjs().startOf('day').add(minutes, 'minutes').format('HH:mm')
}

export const calculateEndTime = (startTimeStr, durationMinutes) => {
  return dayjs(startTimeStr, 'HH:mm')
    .add(durationMinutes, 'minutes')
    .format('HH:mm')
}

export const timeToMinutes = (timeStr) => {
  const time = dayjs(timeStr, 'HH:mm')
  let minutes = time.hour() * 60 + time.minute()

  // If time is between midnight (00:00) and noon (12:00),
  // treat it as next day by adding 24 hours
  if (time.hour() < 12) {
    minutes += 24 * 60
  }

  return minutes
}

export const formatShortDate = (dateStr) => {
  return dayjs(dateStr).format('MMM D')
}

// Helper function to initialize Bootstrap tooltips
export const initializeTooltips = () => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  )
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  )
  return tooltipList
}
