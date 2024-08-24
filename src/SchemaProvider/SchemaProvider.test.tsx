import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { SchemaProvider, useSchemaContext } from './SchemaProvider'
import { object } from 'yup'

describe('SchemaProvider', () => {
  it('should initialize with function values and context', () => {
    const schema = object()
    const values = jest.fn(() => ({ key: 'value' }))
    const context = jest.fn(() => ({ contextKey: 'contextValue' }))

    const TestComponent = () => {
      const { resolvedValues, resolvedContext } = useSchemaContext()
      return (
        <div>
          <span data-testid="values">{JSON.stringify(resolvedValues)}</span>
          <span data-testid="context">{JSON.stringify(resolvedContext)}</span>
        </div>
      )
    }

    const { getByTestId } = render(
      <SchemaProvider schema={schema} values={values} context={context}>
        <TestComponent />
      </SchemaProvider>,
    )

    expect(getByTestId('values').textContent).toBe(JSON.stringify(values()))
    expect(getByTestId('context').textContent).toBe(JSON.stringify(context()))
  })

  it('should initialize values when value and context are objects', () => {
    const schema = object()
    const values = { key: 'value' }
    const context = { contextKey: 'contextValue' }

    const TestComponent = () => {
      const { resolvedValues, resolvedContext } = useSchemaContext()
      return (
        <div>
          <span data-testid="values">{JSON.stringify(resolvedValues)}</span>
          <span data-testid="context">{JSON.stringify(resolvedContext)}</span>
        </div>
      )
    }

    const { getByTestId } = render(
      <SchemaProvider schema={schema} values={values} context={context}>
        <TestComponent />
      </SchemaProvider>,
    )

    expect(getByTestId('values').textContent).toBe(JSON.stringify(values))
    expect(getByTestId('context').textContent).toBe(JSON.stringify(context))
  })

  it('should force update the component with function values and context', () => {
    const TestComponent = () => {
      const { forceUpdate } = useSchemaContext()

      return (
        <div>
          <button onClick={forceUpdate}>Force Update</button>
        </div>
      )
    }

    const values = jest.fn(() => ({ key: 'value' }))
    const context = jest.fn(() => ({ contextKey: 'contextValue' }))

    const { getByText } = render(
      <SchemaProvider schema={object()} values={values} context={context}>
        <TestComponent />
      </SchemaProvider>,
    )

    expect(values).toHaveBeenCalledTimes(1)
    expect(context).toHaveBeenCalledTimes(1)

    const button = getByText('Force Update')
    fireEvent.click(button)
    expect(values).toHaveBeenCalledTimes(2)
    expect(context).toHaveBeenCalledTimes(2)
  })

  it('should update context values when function props change', () => {
    const initialValues = jest.fn(() => ({ key: 'initialValue' }))
    const updatedValues = jest.fn(() => ({ key: 'updatedValue' }))

    const TestComponent = () => {
      const { resolvedValues } = useSchemaContext()
      return <span data-testid="values">{JSON.stringify(resolvedValues)}</span>
    }

    const { getByTestId, rerender } = render(
      <SchemaProvider schema={object()} values={initialValues}>
        <TestComponent />
      </SchemaProvider>,
    )

    expect(getByTestId('values').textContent).toBe(
      JSON.stringify(initialValues()),
    )

    rerender(
      <SchemaProvider schema={object()} values={updatedValues}>
        <TestComponent />
      </SchemaProvider>,
    )

    expect(getByTestId('values').textContent).toBe(
      JSON.stringify(updatedValues()),
    )
  })
})
