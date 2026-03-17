// Centralized data module - import screening data here
import screeningDataJson from './gathering/screenings-tc.json'

export const SCREENING_DATA = {
  ...screeningDataJson,
  // sort by date and time for easier processing in the timetable
  screenings: screeningDataJson.screenings.sort(
    (a, b) =>
      new Date(`${a.date}T${a.startTime}`) -
      new Date(`${b.date}T${b.startTime}`)
  ),
}

// Re-export for convenience
export const { locations, screenings } = SCREENING_DATA
