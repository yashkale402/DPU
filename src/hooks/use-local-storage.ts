
'use client';

import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const item = window.localStorage.getItem(key);
            if (item === null) {
                window.localStorage.setItem(key, JSON.stringify(initialValue));
                setStoredValue(initialValue);
            } else {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(error);
            setStoredValue(initialValue);
        }
    }
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export { useLocalStorage };
