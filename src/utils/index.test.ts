import { renderHook, act } from '@testing-library/react'
import { useForceUpdate, valueOrFunction } from './index'
import { useEffect, useState } from 'react'

describe('useForceUpdate', () => {
  it('should force a re-render', () => {
    const { result } = renderHook(() => {
      const forceUpdate = useForceUpdate()
      const [count, setCount] = useState(0)

      useEffect(() => {
        forceUpdate()
      }, [forceUpdate])

      return { count, setCount }
    })

    expect(result.current.count).toBe(0)

    act(() => {
      result.current.setCount(1)
    })

    expect(result.current.count).toBe(1)
  })
})

describe('valueOrFunction', () => {
  it('should return the value if it is not a function', () => {
    expect(valueOrFunction(42)).toBe(42)
    expect(valueOrFunction('test')).toBe('test')
  })

  it('should return the result of the function if it is a function', () => {
    expect(valueOrFunction(() => 42)).toBe(42)
    expect(valueOrFunction(() => 'test')).toBe('test')
  })
})
