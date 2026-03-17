import { TRAVEL_TIME_MAP } from './constants.js'
import { timeToMinutes } from './dateUtils.js'

// Helper function to get travel time between two locations
export const getTravelTime = (loc1, loc2) => {
  if (loc1 === loc2) return 0
  // Sort to ensure consistent key lookup regardless of order
  const key = [loc1, loc2].sort().join('-')
  return TRAVEL_TIME_MAP[key] || 30 // Default to 30 if not found
}

// Calculate time gap in minutes between two screenings
export const calculateTimeGap = (screening1, screening2) => {
  const start1 = timeToMinutes(screening1.startTime)
  const end1 = timeToMinutes(screening1.endTime)

  const start2 = timeToMinutes(screening2.startTime)
  const end2 = timeToMinutes(screening2.endTime)

  // Gap from screening1 end to screening2 start
  const gapAfter = start2 - end1
  // Gap from screening2 end to screening1 start
  const gapBefore = start1 - end2

  // Return the gap and which screening comes first
  if (gapAfter > 0) {
    return { gap: gapAfter, firstEnds: end1, secondStarts: start2 }
  } else if (gapBefore > 0) {
    return { gap: gapBefore, firstEnds: end2, secondStarts: start1 }
  }
  
  return null // Overlapping or no valid gap
}

// Find travel windows between consecutive screenings at different locations
export const findTravelWindows = (selectedScreenings, allScreenings) => {
  const windows = []

  // Sort selected screenings by start time
  const sortedScreenings = [...selectedScreenings].sort((a, b) => {
    const aStart = timeToMinutes(a.startTime)
    const bStart = timeToMinutes(b.startTime)
    return aStart - bStart
  })

  // Check travel windows between consecutive screenings only
  for (let i = 0; i < sortedScreenings.length - 1; i++) {
    const current = sortedScreenings[i]
    const next = sortedScreenings[i + 1]

    // Skip if same location
    if (current.locationId === next.locationId) {
      continue
    }

    const gapInfo = calculateTimeGap(current, next)
    const requiredTravelTime = getTravelTime(
      current.locationId,
      next.locationId
    )

    // Show gap between consecutive screenings
    if (gapInfo !== null && gapInfo.gap > 0) {
      windows.push({
        screeningId: next.sid,
        location: next.locationId,
        gapMinutes: gapInfo.gap,
        requiredTravelTime,
        isTight: gapInfo.gap < requiredTravelTime,
        conflictingScreeningId: current.sid,
        conflictingTitle: current.title,
        conflictingLocation: current.locationId,
        gapStartMinutes: gapInfo.firstEnds,
        gapEndMinutes: gapInfo.secondStarts,
      })
    }
  }

  return windows
}
