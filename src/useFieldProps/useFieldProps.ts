import { useMemo } from 'react'
import {
  AllFieldProps,
  FieldProps,
  getFieldPropsFromDescription,
} from 'yup-field-props-base'
import { useFieldDescription } from '../useFieldDescription'
import { useSchemaContext } from '../SchemaProvider'
import { SchemaDescription } from 'yup'
import { useForceUpdate, valueOrFunction } from '../utils'

export const useFieldProps = <T extends FieldProps = AllFieldProps>(
  name: string,
) => {
  const fieldDescription = useFieldDescription(name)
  const forceFieldUpdate = useForceUpdate()
  const { values, context, forceUpdate: forceFormUpdate } = useSchemaContext()
  const resolvedValues = valueOrFunction(values)
  const resolvedContext = valueOrFunction(context)

  return useMemo(() => {
    return {
      ...getFieldPropsFromDescription<T>({
        name,
        fieldDescription: fieldDescription as SchemaDescription,
        values: resolvedValues,
        context: resolvedContext,
      }),
      forceFieldUpdate,
      forceFormUpdate,
    }
  }, [
    fieldDescription,
    values,
    context,
    name,
    forceFieldUpdate,
    forceFormUpdate,
  ])
}
