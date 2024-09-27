import { useState, useEffect } from 'react'

function useLanguage(initialValue: any) {
  const getInitialValue = () => {
    if (typeof window !== 'undefined') {
      const savedValue = window.localStorage.getItem('language')
      return savedValue ? savedValue : initialValue
    }
    return initialValue
  }

  const [storedValue, setStoredValue] = useState(getInitialValue())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('language', storedValue)
    }
  }, [storedValue])

  return [storedValue, setStoredValue]
}

export default useLanguage