# yup-field-props-react

A React library to simplify the collection of validation properties of a Yup schema field.

## Description

`yup-field-props-react` is a library that helps you collect form field properties in React applications using Yup schemas. It provides the `useFieldProps` hook and `SchemaProvider` component to easily integrate Yup schema definitions into your form components, with the schema as the single source of truth. While this is possible with `yup` out of the box, `yup-field-props-react` simplifies the process.

## Installation

To install the library:

```bash
npm install yup-field-props-react
```

## useFieldProps hook

Use the `useFieldProps` hook to pickup the validation properties of the field based on the schema and current values

```typescript
import { useFieldProps } from 'yup-field-props-react'

const { min, max, integer, ...others } = useFieldProps('path.to.field')
```

## SchemaProvider component

Use `SchemaProvider` componet to provide the validation schema and current form values to be used by `useFieldProps`

```tsx
import { SchemaProvider } from 'yup-field-props-react'

const schema = yup.object().shape({
  /* etc... */
})
const formValues = getFormValuesFromSomewhere()

return (
  <SchemaProvider schema={schema} values={formValues}>
    {children}
  </SchemaProvider>
)
```

## Simple practical example

```tsx
import { useState, InputHTMLAttributes } from 'react'
import * as yup from 'yup'
import {
  NumberFieldProps,
  SchemaProvider,
  useFieldProps,
} from 'yup-field-props-react'

const schema = yup.object().shape({
  minSize: yup.number().moreThan(1).lessThan(yup.ref('maxSize')).required(),
  maxSize: yup.number().moreThan(yup.ref('minSize')).required(),
  testString: yup
    .string()
    .min(yup.ref('minSize'))
    .max(yup.ref('maxSize'))
    .required(),
})

const NumberInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const fieldPropsResult = useFieldProps<NumberFieldProps>(props.name || '')
  const { required, min, max, lessThan, moreThan } = fieldPropsResult
  let minMessage = min ? `Min ${min}` : moreThan ? `More than ${moreThan}` : ''
  let maxMessage = max ? `Max ${max}` : lessThan ? `Less than ${lessThan}` : ''
  const placeholder = [minMessage, maxMessage].filter(Boolean).join(' and ')

  return (
    <input
      {...props}
      style={{ display: 'block', width: 250 }}
      required={required}
      placeholder={placeholder}
    />
  )
}

const MyForm = () => {
  const [values, setValues] = useState({ minSize: 1, maxSize: 100 })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  return (
    <SchemaProvider schema={schema} values={values}>
      <NumberInput
        name="minSize"
        type="number"
        value={values.minSize}
        onChange={onChange}
      />
      <NumberInput
        name="maxSize"
        type="number"
        value={values.maxSize}
        onChange={onChange}
      />
    </SchemaProvider>
  )
}

export default MyForm
```

## Complex example

For a more complex example utilizing `@mui/material` and `react-hook-form`, see example [examples/react-hook-form.tsx](examples/react-hook-form.tsx)
