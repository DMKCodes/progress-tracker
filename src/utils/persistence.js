// This file provides simple helper functions for managing JSON data from the browser's localStorage.

// Attempt to load state from localStorage.
// If no key or parsing fails, return null.
export function loadState(key) {
  try {
    const raw = localStorage.getItem(key);

    // If nothing stored, return null.
    if (!raw) return null;

    // Attempt decode JSON.
    return JSON.parse(raw);
  } catch (err) {
    // If parsing fails, fail silently and return null.
    console.error('Failed to load from localStorage:', err);
    return null;
  }
}

// Saves JS obj as JSON into localStorage.
// Returns true if successful, false if not.
export function saveState(key, value) {
  try {
    // Convert to JSON and write to localStorage.
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // If save fails, log issue.
    console.error('Failed to save to localStorage:', err);
    return false;
  }
}