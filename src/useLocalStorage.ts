import { useState } from "react"

import { setLocalStorage, getLocalStorage } from "./localStorage"

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        return getLocalStorage(key) ?? initialValue
    })

    function setStateLocalStorage(newValue: T) {
        setValue(newValue)
        setLocalStorage(key, newValue)
    }
    return [value, setStateLocalStorage] as const
}