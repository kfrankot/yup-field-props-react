import { useMemo } from 'react'
import {
  AllFieldProps,
  FieldProps,
  getFieldPropsFromDescription,
} from '@yup-field-props/base'
import { useFieldDescription } from '../useFieldDescription'
import { useSchemaContext } from '../YupSchemaProvider'
import { SchemaDescription } from 'yup'

export const useFieldProps = <T extends FieldProps = AllFieldProps>(
  name: string,
) => {
  const fieldDescription = useFieldDescription(name)
  const { values, context, forceUpdate } = useSchemaContext()

  return useMemo(() => {
    return {
      ...getFieldPropsFromDescription<T>({
        name,
        fieldDescription: fieldDescription as SchemaDescription,
        values,
        context,
      }),
      forceUpdate,
    }
  }, [fieldDescription, values, context, name, forceUpdate])
}
