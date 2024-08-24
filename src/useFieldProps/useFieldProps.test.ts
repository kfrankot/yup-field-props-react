import { renderHook, act } from '@testing-library/react'
import { useFieldProps } from './useFieldProps'
import { useFieldDescription } from '../useFieldDescription'
import { useSchemaContext } from '../SchemaProvider'
import { getFieldPropsFromDescription } from 'yup-field-props-base'
import { SchemaDescription } from 'yup'

// Mock the useFieldDescription hook
jest.mock('../useFieldDescription', () => ({
  useFieldDescription: jest.fn(),
}))

// Mock the useSchemaContext hook
jest.mock('../SchemaProvider', () => ({
  useSchemaContext: jest.fn(),
}))

// Mock the getFieldPropsFromDescription function
jest.mock('yup-field-props-base', () => ({
  getFieldPropsFromDescription: jest.fn(),
}))

describe('useFieldProps', () => {
  const mockFieldDescription = {} as SchemaDescription // mock field description object
  const mockValues = {} // mock values object
  const mockContext = {} // mock context object
  const mockForceUpdate = jest.fn()
  const mockFieldProps = {} // mock field props object

  beforeEach(() => {
    ;(useFieldDescription as jest.Mock).mockReturnValue(mockFieldDescription)
    ;(useSchemaContext as jest.Mock).mockReturnValue({
      values: mockValues,
      context: mockContext,
      forceUpdate: mockForceUpdate,
    })
    ;(getFieldPropsFromDescription as jest.Mock).mockReturnValue(mockFieldProps)
  })

  it('returns the correct field props for a given field name', () => {
    const { result } = renderHook(() => useFieldProps('mockFieldName'))

    expect(useFieldDescription).toHaveBeenCalledWith('mockFieldName')
    expect(getFieldPropsFromDescription).toHaveBeenCalledWith({
      name: 'mockFieldName',
      fieldDescription: mockFieldDescription,
      values: mockValues,
      context: mockContext,
    })
    expect(result.current).toEqual({
      ...mockFieldProps,
      forceFieldUpdate: expect.any(Function),
      forceFormUpdate: mockForceUpdate,
    })
  })

  it('updates the field props when the field name changes', () => {
    const mockFieldProps1 = {
      min: 1,
    } // mock field props object 1
    const mockFieldProps2 = {
      min: 2,
    } // mock field props object 2

    ;(getFieldPropsFromDescription as jest.Mock)
      .mockReturnValueOnce(mockFieldProps1)
      .mockReturnValueOnce(mockFieldProps2)

    const { result, rerender } = renderHook(({ name }) => useFieldProps(name), {
      initialProps: { name: 'mockFieldName1' },
    })

    expect(result.current).toEqual({
      ...mockFieldProps1,
      forceFieldUpdate: expect.any(Function),
      forceFormUpdate: mockForceUpdate,
    })

    rerender({ name: 'mockFieldName2' })

    expect(result.current).toEqual({
      ...mockFieldProps2,
      forceFieldUpdate: expect.any(Function),
      forceFormUpdate: mockForceUpdate,
    })
  })

  it('updates the field props when schema, values, or context changes', () => {
    const mockFieldProps1 = {} // mock field props object 1
    const mockFieldProps2 = {} // mock field props object 2

    ;(getFieldPropsFromDescription as jest.Mock)
      .mockReturnValueOnce(mockFieldProps1)
      .mockReturnValueOnce(mockFieldProps2)

    const { result, rerender } = renderHook(() =>
      useFieldProps('mockFieldName'),
    )

    expect(result.current).toEqual({
      ...mockFieldProps1,
      forceFieldUpdate: expect.any(Function),
      forceFormUpdate: mockForceUpdate,
    })

    // Change schema, values, or context
    ;(useSchemaContext as jest.Mock).mockReturnValue({
      values: {}, // new mock values object
      context: {}, // new mock context object
      forceUpdate: mockForceUpdate,
    })

    rerender()

    expect(result.current).toEqual({
      ...mockFieldProps2,
      forceFieldUpdate: expect.any(Function),
      forceFormUpdate: mockForceUpdate,
    })
  })

  it('handles values and context as functions and applies forced updates correctly', () => {
    const mockFieldDescription = {} as SchemaDescription
    const mockValuesFunction = jest.fn().mockReturnValue({ key: 'value' })
    const mockContextFunction = jest.fn().mockReturnValue({ key: 'context' })
    const mockForceUpdate = jest.fn()
    const mockFieldProps = {} // mock field props object

    ;(useFieldDescription as jest.Mock).mockReturnValue(mockFieldDescription)
    ;(useSchemaContext as jest.Mock).mockReturnValue({
      values: mockValuesFunction,
      context: mockContextFunction,
      forceUpdate: mockForceUpdate,
    })
    ;(getFieldPropsFromDescription as jest.Mock).mockReturnValue(mockFieldProps)

    const { result } = renderHook(() => useFieldProps('mockFieldName'))

    expect(mockValuesFunction).toHaveBeenCalled()
    expect(mockContextFunction).toHaveBeenCalled()
    expect(getFieldPropsFromDescription).toHaveBeenCalledWith({
      name: 'mockFieldName',
      fieldDescription: mockFieldDescription,
      values: { key: 'value' },
      context: { key: 'context' },
    })
    expect(result.current).toEqual({
      ...mockFieldProps,
      forceFieldUpdate: expect.any(Function),
      forceFormUpdate: mockForceUpdate,
    })
  })

  it('triggers re-render and updates field props when forceFieldUpdate is called', () => {
    const mockFieldProps1 = { prop: 'initial' }
    const mockFieldProps2 = { prop: 'updated' }

    ;(getFieldPropsFromDescription as jest.Mock)
      .mockReturnValueOnce(mockFieldProps1)
      .mockReturnValueOnce(mockFieldProps2)
    ;(useSchemaContext as jest.Mock)
      .mockReturnValueOnce({
        values: () => {},
        context: () => {},
        forceUpdate: mockForceUpdate,
      })
      .mockReturnValueOnce({
        values: () => {},
        context: () => {},
        forceUpdate: mockForceUpdate,
      })

    const { result } = renderHook(() => useFieldProps('mockFieldName'))

    expect(result.current).toEqual({
      ...mockFieldProps1,
      forceFieldUpdate: expect.any(Function),
      forceFormUpdate: mockForceUpdate,
    })

    act(() => {
      result.current.forceFieldUpdate()
    })

    expect(result.current).toEqual({
      ...mockFieldProps2,
      forceFieldUpdate: expect.any(Function),
      forceFormUpdate: mockForceUpdate,
    })
  })
})
