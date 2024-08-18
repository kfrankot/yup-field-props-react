import { renderHook } from '@testing-library/react'
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
      forceUpdate: mockForceUpdate,
    })
  })

  it('updates the field props when the field name changes', () => {
    const mockFieldProps1 = {} // mock field props object 1
    const mockFieldProps2 = {} // mock field props object 2

    ;(getFieldPropsFromDescription as jest.Mock)
      .mockReturnValueOnce(mockFieldProps1)
      .mockReturnValueOnce(mockFieldProps2)

    const { result, rerender } = renderHook(({ name }) => useFieldProps(name), {
      initialProps: { name: 'mockFieldName1' },
    })

    expect(result.current).toEqual({
      ...mockFieldProps1,
      forceUpdate: mockForceUpdate,
    })

    rerender({ name: 'mockFieldName2' })

    expect(result.current).toEqual({
      ...mockFieldProps2,
      forceUpdate: mockForceUpdate,
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
      forceUpdate: mockForceUpdate,
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
      forceUpdate: mockForceUpdate,
    })
  })
})
