/**
 * Travel time matrix between cinema locations (in minutes)
 * Only stores one direction to avoid duplication (from->to is same as to->from)
 * Locations:
 * TS - CWB Times Square
 * CT - HK City Hall
 * AC - Wanchai Arts Centre
 * EK - Elements (Kowloon)
 * PE - Premiere element (TST)
 * MC - M plus, West Kowloon
 * KG - Kowloon Grand Theatre, TST
 * IS - iSQUARE, TST
 * GL - gala cinema, langham place, mongkok
 */
export const TRAVEL_TIME_MAP = {
  'AC-CT': 20, // https://maps.app.goo.gl/9axP7fRpQw7eEnDQ7
  'AC-EK': 43, // https://maps.app.goo.gl/8W4f86yraxP21BP28
  'AC-GL': 25, // https://maps.app.goo.gl/2ovYjZ9PqkZ89xXm9
  'AC-IS': 18, // https://maps.app.goo.gl/e5rvKMv9aDdHHn2LA
  'AC-KG': 17, // https://maps.app.goo.gl/aJmFo7VWxXZo9ALz5
  'AC-MC': 37, // https://maps.app.goo.gl/TRcQPnBoMz2LrnVF8
  'AC-PE': 31, // https://maps.app.goo.gl/7TaTdyJ8PivDWvo88
  'AC-TS': 17, // https://maps.app.goo.gl/scthBqXznUi2YNZs5
  'CT-EK': 47, // https://maps.app.goo.gl/b9iTZwwtD11Hd7tM8
  'CT-GL': 22, // https://maps.app.goo.gl/poLPoa1yPyjnFbBJ6
  'CT-IS': 15, // https://maps.app.goo.gl/z43Vr9obTQRtpvRs6
  'CT-KG': 23, // https://maps.app.goo.gl/rM4QHzmibBDxGobG6
  'CT-MC': 21, // https://maps.app.goo.gl/uc8KmxNAzk1PjpZc9
  'CT-PE': 15, // https://maps.app.goo.gl/qjNs8wR7AxBu7fGC9
  'CT-TS': 21, // https://maps.app.goo.gl/F8dAyCcMsu9FFBsw5
  'EK-GL': 27, // https://maps.app.goo.gl/iGeppYGQWEVsJReQ9
  'EK-IS': 28, // https://maps.app.goo.gl/rAE2Lg51QJBvDpvr9
  'EK-KG': 15, // https://maps.app.goo.gl/NGa3bj1Mh24zw6668
  'EK-MC': 20, // https://maps.app.goo.gl/FMa2PaCUj5jbDp6aA
  'EK-PE': 49, // https://maps.app.goo.gl/Rgi4Q6r4BDe7Rkk66
  'EK-TS': 44, // https://maps.app.goo.gl/Jjnzdp19hmi8jrCw6
  'GL-IS': 9 + 5, // https://maps.app.goo.gl/38yn1dURRQJUX2mF7
  'GL-KG': 17, // https://maps.app.goo.gl/9QrgcMgpM23Lcvwt8
  'GL-MC': 29, // https://maps.app.goo.gl/N2tByNKG5DKfsPse9
  'GL-PE': 23, // https://maps.app.goo.gl/9NP4VSTKL94yX5yn7
  'GL-TS': 28, // https://maps.app.goo.gl/fqrDppcHxyfG15Ne9
  'IS-KG': 8 + 3, // https://maps.app.goo.gl/Ude5mp2Z5ykyMGvP6
  'IS-MC': 30, // https://maps.app.goo.gl/QFYX6Hd8YZYDTW6dA
  'IS-PE': 15, // https://maps.app.goo.gl/m6Jvu8wX1XY473ET8
  'IS-TS': 21, // https://maps.app.goo.gl/kgxfdVeyZ1yfPpiV8
  'KG-MC': 25, // https://maps.app.goo.gl/n8qNSkU6YyUWhqLK9
  'KG-PE': 15, // https://maps.app.goo.gl/FcNCukWTiEEzXoUH8
  'KG-TS': 29, // https://maps.app.goo.gl/7bNejMioxtw3QfyR6
  'MC-PE': 12, // https://maps.app.goo.gl/WxnG9hd4dcmWDLYF9
  'MC-TS': 37, // https://maps.app.goo.gl/3NZ71pemhBhWj5baA
  'PE-TS': 30, // https://maps.app.goo.gl/D6YuZs5AW6kp2q2m9
}

export const HKIFF_DOMAIN = 'https://www.hkiff.org.hk'

// Time grid configuration (in minutes)
export const EARLIEST_MINUTES = 12 * 60 // 12:00 PM
export const LATEST_MINUTES = 24 * 60 // 12:00 AM
export const TOTAL_GRID_MINUTES = LATEST_MINUTES - EARLIEST_MINUTES

// Highlight animation duration (in milliseconds)
// Total duration: 3000ms = 1s per pulse × 3 iterations
// Keep in sync with CSS animation in styles.css (.screening-block.highlight-pulse)
export const HIGHLIGHT_DURATION_MS = 3000
