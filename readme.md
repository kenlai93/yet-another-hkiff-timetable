# HKIFF50 Timetable

A very simple film festival screening scheduler with conflict detection and export features. Can adjust your data set and apply for HKIFF50, 51, 52, summerIFF, HKAFF, clockflap so on and so on,

![timetable](./assets/timetable.png)

## Other Similar Project

### Film Testable

- https://filmfestable.com

### yellowcandle/hkiff-2026

- https://hkiff.herballemon.dev
- https://github.com/yellowcandle/hkiff-2026

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build    # Output to dist/
npm run preview  # Preview production build
```

## Project Structure

```
├── index.html
├── src/
│   ├── app.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── DateNavigator.jsx
│   │   ├── LocationRow.jsx
│   │   ├── ScreeningBlock.jsx
│   │   ├── TimeAxis.jsx
│   │   └── Timetable.jsx
│   ├── data/
│   │   ├── index.js
│   │   └── gathering/
│   │       ├── screenings-en.json
│   │       └── screenings-tc.json
│   └── utils/
│       ├── constants.js
│       ├── dateUtils.js
│       ├── exportUtils.js
│       └── screeningUtils.js
```

## Features

- Visual timeline grid (12pm - midnight)
- Travel time conflict detection
- Auto-save selections to local storage
- CSV and ICS calendar export

## Tech Stack

- React 19 + Vite
- Bootstrap 5.3 + Icons
- dayjs
