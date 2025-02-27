export function setLocalStorage<T>(key: string, value: T) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.log(error)
    }
}

export function getLocalStorage<T>(key: string): T | null {
    try {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) as T : null
    } catch (error) {
        console.log(error)
        return null
    }
}