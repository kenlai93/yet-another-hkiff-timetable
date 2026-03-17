// Export to plain text / CSV format
export const exportToCSV = (selectedScreenings, onSuccess, onError) => {
  if (selectedScreenings.length === 0) {
    alert('No screenings selected to export')
    return
  }

  // CSV format: Title,Date,Start Time,End Time,Duration (min),Location,Director,Category
  const header =
    'Title,Date,Start Time,End Time,Duration (min),Location,Director,Category'
  const rows = selectedScreenings.map((s) => {
    // Escape commas and quotes in CSV format
    const escapeCSV = (str) => {
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"'
      }
      return str
    }

    return [
      escapeCSV(s.title),
      s.date,
      s.startTime,
      s.endTime,
      s.durationMinutes,
      s.locationId,
      escapeCSV(s.director),
      escapeCSV(s.subCat),
    ].join(',')
  })

  const csvContent = [header, ...rows].join('\n')

  // Copy to clipboard
  navigator.clipboard.writeText(csvContent).then(
    () => {
      if (onSuccess) onSuccess()
    },
    (err) => {
      if (onError) {
        onError(err)
      } else {
        alert('Failed to copy to clipboard: ' + err)
      }
    }
  )
}

// Export to ICS calendar format
export const exportToICS = (selectedScreenings) => {
  if (selectedScreenings.length === 0) {
    alert('No screenings selected to export')
    return
  }

  // ICS format helpers
  const formatICSDate = (dateStr, timeStr) => {
    // dateStr: '2026-03-12', timeStr: '12:00'
    const [year, month, day] = dateStr.split('-')
    const [hour, minute] = timeStr.split(':')
    // Format: YYYYMMDDTHHmmss
    return `${year}${month}${day}T${hour.padStart(2, '0')}${minute.padStart(
      2,
      '0'
    )}00`
  }

  const escapeICS = (str) => {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
  }

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HKIFF50 Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:HKIFF50 Screenings',
    'X-WR-TIMEZONE:Asia/Hong_Kong',
  ]

  selectedScreenings.forEach((s) => {
    const dtStart = formatICSDate(s.date, s.startTime)
    const dtEnd = formatICSDate(s.date, s.endTime)
    const uid = `${s.sid}@hkiff50-timetable`
    const summary = escapeICS(s.title)
    const description = escapeICS(
      `Director: ${s.director}\nCategory: ${s.subCat}\nDuration: ${s.durationMinutes} minutes`
    )
    const location = escapeICS(s.locationId)

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatICSDate(
        new Date().toISOString().split('T')[0],
        '00:00'
      )}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    )
  })

  icsContent.push('END:VCALENDAR')

  const icsText = icsContent.join('\r\n')

  // Create blob and download
  const blob = new Blob([icsText], {
    type: 'text/calendar;charset=utf-8',
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `HKIFF50-Screenings-${
    new Date().toISOString().split('T')[0]
  }.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
