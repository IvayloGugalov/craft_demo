import { FormFields } from '../types/Form'

export interface LocalStorageState {
  'form-fields': FormFields
}

export interface Store<K extends keyof LocalStorageState> {
  getItem: (key: K) => LocalStorageState[K] | null
  setItem: (key: K, val: LocalStorageState[K]) => void
  removeItem: (key: K) => void
}

export function localStorage(): Store<keyof LocalStorageState> | undefined {
  const { localStorage } = window

  return {
    getItem: (key: string) => {
      const value = localStorage.getItem(key) ?? null
      if (value) return JSON.parse(value)
      return null
    },
    setItem: <K extends keyof LocalStorageState>(key: string, value: LocalStorageState[K]) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (e) {
        localStorage.clear()
        console.error(`Can't append more :/\n${JSON.stringify(value)}`)

        // try again
        localStorage.setItem(key, JSON.stringify(value))
      }
    },
    removeItem: (key: string) => localStorage.removeItem(key),
  }
}
