/**
 * Utility to handle date and time specific to Asia/Jakarta (WIB)
 */

/**
 * Returns the current date in YYYY-MM-DD format based on Asia/Jakarta time.
 * This ensures consistency even if the user's device or the server is in a different timezone.
 */
export function getWIBDate() {
  const options = { 
    timeZone: 'Asia/Jakarta', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  };
  
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  return formatter.format(new Date()); // Returns YYYY-MM-DD
}

/**
 * Returns the current time in ISO string format adjusted for Jakarta
 */
export function getWIBTimestamp() {
  return new Date().toISOString();
}

/**
 * Checks if a timestamp belongs to "today" in WIB
 */
export function isTodayWIB(timestamp) {
  if (!timestamp) return false;
  const today = getWIBDate();
  const date = new Date(timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
  return today === date;
}
