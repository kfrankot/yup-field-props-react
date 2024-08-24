import { useCallback, useState } from 'react'

export const useForceUpdate = () => {
  const [, setRandom] = useState({})

  const forceUpdate = useCallback(() => {
    setRandom({})
  }, [])

  return forceUpdate
}

export const valueOrFunction = <T>(valueOrFunction: T | (() => T)): T => {
  return typeof valueOrFunction === 'function'
    ? (valueOrFunction as () => T)()
    : valueOrFunction
}
