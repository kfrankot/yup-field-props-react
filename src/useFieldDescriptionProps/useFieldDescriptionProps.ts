import { useMemo } from 'react'
import { AllFieldProps, FieldProps, getPropsFromFieldDescription } from '@yup-field-props/base'
import { useYupFieldDescription } from '../useFieldDescription'

export const useYupFieldProps = <T extends FieldProps = AllFieldProps>(
  name: string,
) => {
  const fieldDescription = useYupFieldDescription(name)

  return useMemo(() => {
    return getPropsFromFieldDescription<T>(fieldDescription)
  }, [fieldDescription])
}
