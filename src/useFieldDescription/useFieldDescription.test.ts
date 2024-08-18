import { renderHook } from '@testing-library/react'
import { useFieldDescription } from './useFieldDescription'
import { useSchemaContext } from '../SchemaProvider'
import {
  getFieldPathsFromName,
  getFieldDescriptionFromPaths,
} from '@yup-field-props/base'

// Mock the useSchemaContext hook
jest.mock('../SchemaProvider', () => ({
  useSchemaContext: jest.fn(),
}))

// Mock the getFieldPathsFromName and getFieldDescriptionFromPaths functions
jest.mock('@yup-field-props/base', () => ({
  getFieldPathsFromName: jest.fn(),
  getFieldDescriptionFromPaths: jest.fn(),
}))

describe('useFieldDescription', () => {
  const mockSchema = {
    /* mock schema object */
  }
  const mockValues = {
    /* mock values object */
  }
  const mockContext = {
    /* mock context object */
  }

  beforeEach(() => {
    ;(useSchemaContext as jest.Mock).mockReturnValue({
      schema: mockSchema,
      values: mockValues,
      context: mockContext,
    })
  })

  it('returns the correct field description for a given field name', () => {
    const mockFieldPaths = {
      valuePath: 'mockValuePath',
      parentPath: 'mockParentPath',
    }
    const mockFieldDescription = {
      /* mock field description object */
    }

    ;(getFieldPathsFromName as jest.Mock).mockReturnValue(mockFieldPaths)
    ;(getFieldDescriptionFromPaths as jest.Mock).mockReturnValue(
      mockFieldDescription,
    )

    const { result } = renderHook(() => useFieldDescription('mockFieldName'))

    expect(getFieldPathsFromName).toHaveBeenCalledWith('mockFieldName')
    expect(getFieldDescriptionFromPaths).toHaveBeenCalledWith({
      valuePath: 'mockValuePath',
      parentPath: 'mockParentPath',
      schema: mockSchema,
      values: mockValues,
      context: mockContext,
    })
    expect(result.current).toBe(mockFieldDescription)
  })

  it('updates the field description when the field name changes', () => {
    const mockFieldPaths1 = {
      valuePath: 'mockValuePath1',
      parentPath: 'mockParentPath1',
    }
    const mockFieldDescription1 = {
      /* mock field description object 1 */
    }
    const mockFieldPaths2 = {
      valuePath: 'mockValuePath2',
      parentPath: 'mockParentPath2',
    }
    const mockFieldDescription2 = {
      /* mock field description object 2 */
    }

    ;(getFieldPathsFromName as jest.Mock)
      .mockReturnValueOnce(mockFieldPaths1)
      .mockReturnValueOnce(mockFieldPaths2)
    ;(getFieldDescriptionFromPaths as jest.Mock)
      .mockReturnValueOnce(mockFieldDescription1)
      .mockReturnValueOnce(mockFieldDescription2)

    const { result, rerender } = renderHook(
      ({ name }) => useFieldDescription(name),
      {
        initialProps: { name: 'mockFieldName1' },
      },
    )

    expect(result.current).toBe(mockFieldDescription1)

    rerender({ name: 'mockFieldName2' })

    expect(result.current).toBe(mockFieldDescription2)
  })

  it('updates the field description when schema, values, or context changes', () => {
    const mockFieldPaths = {
      valuePath: 'mockValuePath',
      parentPath: 'mockParentPath',
    }
    const mockFieldDescription1 = {
      /* mock field description object 1 */
    }
    const mockFieldDescription2 = {
      /* mock field description object 2 */
    }

    ;(getFieldPathsFromName as jest.Mock).mockReturnValue(mockFieldPaths)
    ;(getFieldDescriptionFromPaths as jest.Mock)
      .mockReturnValueOnce(mockFieldDescription1)
      .mockReturnValueOnce(mockFieldDescription2)

    const { result, rerender } = renderHook(() =>
      useFieldDescription('mockFieldName'),
    )

    expect(result.current).toBe(mockFieldDescription1)

    // Change schema, values, or context
    ;(useSchemaContext as jest.Mock).mockReturnValue({
      schema: {
        /* new mock schema object */
      },
      values: {
        /* new mock values object */
      },
      context: {
        /* new mock context object */
      },
    })

    rerender()

    expect(result.current).toBe(mockFieldDescription2)
  })
})