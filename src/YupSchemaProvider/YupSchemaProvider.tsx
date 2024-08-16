import React, {
  useContext,
  createContext,
  useMemo,
  useRef,
  ReactNode,
  useCallback,
} from 'react'
import { AnyObject, ObjectSchema, SchemaObjectDescription } from 'yup'
import fastDeepEqual from 'fast-deep-equal/es6'

// TODO: Add support for generics
export type YupSchemaProviderProps = {
  schema: ObjectSchema<any, AnyObject, any, ''>
  values?: any
  getValues?: () => any
  disableDeepEqualCheck?: boolean
  children: ReactNode
}

export const YupSchemaContext = createContext<{
  description: SchemaObjectDescription | null
  forceUpdate: () => void
}>({ description: null, forceUpdate: () => {} })

export const YupSchemaProvider = ({
  schema,
  values: valuesProp,
  getValues,
  disableDeepEqualCheck,
  children,
}: YupSchemaProviderProps) => {

  // Implement a forceUpdate function to force re-render
  const [, setRandom] = React.useState(Math.random())

  const forceUpdate = useCallback(() => {
    setRandom(Math.random())
  }, [])

  const values = getValues ? getValues() : valuesProp
  const context = useMemo(
    () => ({
      description: schema.describe({ value: values }),
      forceUpdate,
    }),
    [schema, values, forceUpdate],
  )

  // Its very likely the describe method will be the exact same despite the schema and values changing
  // so provide some protection to avoid unnecessary re-renders on every input change

  // TODO: Need to verify performance improvement
  const contextRef = useRef(context)
  if (
    disableDeepEqualCheck ||
    (contextRef.current !== context &&
      !fastDeepEqual(contextRef.current, context))
  ) {
    contextRef.current = context
  }

  return (
    <YupSchemaContext.Provider value={contextRef.current}>
      {children}
    </YupSchemaContext.Provider>
  )
}

export const useYupSchemaContext = () => {
  return useContext(YupSchemaContext)
}
