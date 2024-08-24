import { useMemo } from 'react'
import { useSchemaContext } from '../SchemaProvider'
import {
  getFieldPathsFromName,
  getFieldDescriptionFromPaths,
} from 'yup-field-props-base'
import { valueOrFunction } from '../utils'

export const useFieldDescription = (name: string) => {
  const { schema, values, context } = useSchemaContext()
  const resolvedValues = valueOrFunction(values)
  const resolvedContext = valueOrFunction(context)

  const { valuePath, parentPath } = useMemo(() => {
    return getFieldPathsFromName(name)
  }, [name])

  return useMemo(() => {
    return getFieldDescriptionFromPaths({
      valuePath,
      parentPath,
      schema,
      values: resolvedValues,
      context: resolvedContext,
    })
  }, [resolvedValues, name, valuePath, parentPath, schema, resolvedContext])
}
