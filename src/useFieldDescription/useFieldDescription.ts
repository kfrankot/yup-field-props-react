import { useMemo } from 'react'
import { useSchemaContext } from '../YupSchemaProvider'
import {
  getFieldPathsFromName,
  getFieldDescriptionFromPaths,
} from '@yup-field-props/base'

export const useFieldDescription = (name: string) => {
  const { schema, values, context } = useSchemaContext()

  const { valuePath, parentPath } = useMemo(() => {
    return getFieldPathsFromName(name)
  }, [name])

  return useMemo(() => {
    return getFieldDescriptionFromPaths({
      valuePath,
      parentPath,
      schema,
      values,
      context,
    })
  }, [values, name, valuePath, parentPath, schema, context])
}
