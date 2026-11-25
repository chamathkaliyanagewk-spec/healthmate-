// dateUtils.js - small helper functions for dates.
// Dates are stored in the database as TEXT in the format "yyyy-MM-dd" (e.g. "2026-11-25").
// This format is useful because it sorts correctly and is easy to search with "WHERE date = ?".

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Turns a JavaScript Date into "yyyy-MM-dd"
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Today's date as "yyyy-MM-dd"
export function getTodayString() {
  return formatDate(new Date());
}

// The date "n" days ago as "yyyy-MM-dd" (used for dummy data)
export function daysAgoString(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDate(d);
}

// Turns "yyyy-MM-dd" back into a JavaScript Date
export function parseDate(text) {
  const [year, month, day] = text.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Turns "2026-11-25" into "25 November 2026" for showing on screen
export function displayDate(text) {
  const [year, month, day] = text.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
