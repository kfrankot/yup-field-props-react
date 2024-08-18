import React, {
  useContext,
  useState,
  createContext,
  useMemo,
  ReactNode,
  useCallback,
} from 'react'
import { AnyObject, ObjectSchema, object } from 'yup'

// TODO: Add support for generics
export type SchemaProviderProps = {
  schema: ObjectSchema<any, AnyObject, any, ''>
  values: AnyObject | (() => AnyObject)
  context?: AnyObject | (() => AnyObject)
  children?: ReactNode
}

export const SchemaContext = createContext<
  Omit<SchemaProviderProps, 'children'> & {
    forceUpdate: () => void
  }
>({ schema: object(), values: {}, context: undefined, forceUpdate: () => {} })

export const SchemaProvider = ({
  schema,
  values: valuesProp,
  context: contextProp,
  children,
}: SchemaProviderProps) => {
  const [, setRandom] = useState(Math.random())

  const forceUpdate = useCallback(() => {
    setRandom(Math.random())
  }, [])

  const values = typeof valuesProp === 'function' ? valuesProp() : valuesProp
  const yupContext =
    typeof contextProp === 'function' ? contextProp() : contextProp
  const context = useMemo(
    () => ({
      schema,
      values,
      context: yupContext,
      forceUpdate,
    }),
    [schema, values, yupContext, forceUpdate],
  )

  return (
    <SchemaContext.Provider value={context}>{children}</SchemaContext.Provider>
  )
}

export const useSchemaContext = () => {
  return useContext(SchemaContext)
}
