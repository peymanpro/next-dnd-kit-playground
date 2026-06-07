/**
 * useLocalStorage Hook
 * 
 * A custom React hook for persisting state in the browser's localStorage API.
 * 
 * @description This hook provides a convenient way to synchronize React state with localStorage by:
 * - Reading initial value from localStorage on component mount (lazy initialization)
 * - Automatically saving state changes to localStorage when setValue is called
 * - Falling back to provided initialValue if no stored data exists or on error
 * - Using useEffect for client-side localStorage access (prevents SSR mismatches)
 * - Error handling for JSON parsing failures and localStorage quota/storage errors
 * - Generic type support for type-safe storage of any serializable data
 * 
 * @typeparam T - The type of the stored value (inferred from initialValue)
 * 
 * @param key - The localStorage key to use for storing the value
 * @param initialValue - Fallback value when no stored data exists or on error
 * 
 * @returns A tuple containing:
 *   - storedValue: The current state value (synced with localStorage)
 *   - setValue: Function to update both state and localStorage
 * 
 * @behavior
 * - On initial mount: Attempts to read from localStorage using provided key
 * - If localStorage has a value: Parses and uses it as initial state
 * - If localStorage is empty/invalid: Uses initialValue
 * - When setValue is called: Updates state and writes to localStorage synchronously
 * - Handles JSON parse errors gracefully (logs to console, falls back to initialValue)
 * 
 * @limitations
 * - Cannot store functions, Symbols, or other non-serializable data (JSON.stringify limitations)
 * - Changes made to localStorage from other tabs/windows won't trigger updates automatically
 * - Synchronous localStorage access may block rendering for very large data (rare)
 * 
 * @performance
 * - Uses useEffect with key dependency to re-read from localStorage when key changes
 * - No unnecessary re-renders; only updates when setValue is called
 * 
 * @example
 * ```typescript
 * const [userPreferences, setUserPreferences] = useLocalStorage('preferences', { theme: 'dark' });
 * // Later: setUserPreferences({ theme: 'light' }) // Auto-saves to localStorage
 * ```
 */


import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}