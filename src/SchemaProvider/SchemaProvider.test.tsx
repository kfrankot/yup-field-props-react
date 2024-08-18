import React from 'react'
import { object } from 'yup'
import { SchemaProvider, useSchemaContext } from './SchemaProvider'
import { fireEvent, render } from '@testing-library/react'

describe('SchemaProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with given schema and values', () => {
    const schema = object()
    const values = { key: 'value' }
    const context = { contextKey: 'contextValue' }

    const TestComponent = () => {
      const { schema, values, context } = useSchemaContext()
      return (
        <div>
          <span data-testid="schema">{JSON.stringify(schema)}</span>
          <span data-testid="values">{JSON.stringify(values)}</span>
          <span data-testid="context">{JSON.stringify(context)}</span>
        </div>
      )
    }

    const { getByTestId } = render(
      <SchemaProvider schema={schema} values={values} context={context}>
        <TestComponent />
      </SchemaProvider>,
    )

    expect(getByTestId('schema').textContent).toBe(JSON.stringify(schema))
    expect(getByTestId('values').textContent).toBe(JSON.stringify(values))
    expect(getByTestId('context').textContent).toBe(JSON.stringify(context))
  })

  it('should force update the component when forceUpdate is called', () => {
    const TestComponent = () => {
      const { forceUpdate } = useSchemaContext()

      return (
        <div>
          <button onClick={forceUpdate}>Force Update</button>
        </div>
      )
    }

    const values = jest.fn(() => ({}))
    const context = jest.fn(() => ({}))

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

  it('should update context values when props change', () => {
    const initialValues = { key: 'initialValue' }
    const updatedValues = { key: 'updatedValue' }

    const TestComponent = () => {
      const { values } = useSchemaContext()
      return <span data-testid="values">{JSON.stringify(values)}</span>
    }

    const { getByTestId, rerender } = render(
      <SchemaProvider schema={object()} values={initialValues}>
        <TestComponent />
      </SchemaProvider>,
    )

    expect(getByTestId('values').textContent).toBe(
      JSON.stringify(initialValues),
    )

    rerender(
      <SchemaProvider schema={object()} values={updatedValues}>
        <TestComponent />
      </SchemaProvider>,
    )

    expect(getByTestId('values').textContent).toBe(
      JSON.stringify(updatedValues),
    )
  })
})
