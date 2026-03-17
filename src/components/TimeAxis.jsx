import { minutesToTime } from '../utils/dateUtils.js'
import { EARLIEST_MINUTES, LATEST_MINUTES } from '../utils/constants.js'

export const TimeAxis = () => {
  const timeLabels = []
  const startHour = EARLIEST_MINUTES / 60
  const endHour = LATEST_MINUTES / 60
  const totalHours = endHour - startHour

  for (let i = 0; i <= totalHours; i++) {
    const hour = (startHour + i) % 24
    const position = (i / totalHours) * 100
    const hourMinutes = (startHour + i) * 60
    timeLabels.push({
      hour,
      position,
      label: minutesToTime(hourMinutes),
    })
  }

  return (
    <div className="time-axis">
      {timeLabels.map((timeLabel, index) => (
        <div
          key={index}
          className="time-label"
          style={{ left: `${timeLabel.position}%` }}
        >
          {timeLabel.label}
        </div>
      ))}
    </div>
  )
}
