import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.jsx'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles.css'

// Initialize Bootstrap JS
import * as bootstrap from 'bootstrap'

// Make dayjs and bootstrap globally available for utility functions
window.dayjs = dayjs
window.bootstrap = bootstrap

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
