import React, { useContext, createContext, useMemo, ReactNode } from 'react'
import { AnyObject, ObjectSchema, object } from 'yup'
import { useForceUpdate, valueOrFunction } from '../utils'

// TODO: Add support for generics
export type SchemaProviderProps = {
  schema: ObjectSchema<any, AnyObject, any, ''>
  values: AnyObject | (() => AnyObject)
  context?: AnyObject | (() => AnyObject)
  children?: ReactNode
}

export type SchemaProviderContext = Omit<SchemaProviderProps, 'children'> & {
  forceUpdate: () => void
  resolvedValues: AnyObject
  resolvedContext?: AnyObject
}

export const SchemaContext = createContext<SchemaProviderContext>({
  schema: object(),
  values: {},
  context: undefined,
  resolvedValues: {},
  resolvedContext: undefined,
  forceUpdate: () => {},
})

export const SchemaProvider = ({
  schema,
  values,
  context: yupContext,
  children,
}: SchemaProviderProps) => {
  const forceUpdate = useForceUpdate()

  const resolvedValues = valueOrFunction(values)
  const resolvedContext = valueOrFunction(yupContext)
  const context = useMemo(
    () => ({
      schema,
      values,
      context: yupContext,
      resolvedValues,
      resolvedContext,
      forceUpdate,
    }),
    [schema, values, yupContext, resolvedValues, resolvedContext, forceUpdate],
  )

  return (
    <SchemaContext.Provider value={context}>{children}</SchemaContext.Provider>
  )
}

export const useSchemaContext = () => {
  return useContext(SchemaContext)
}
