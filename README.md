# yup-field-props-react

A React library that simplifies extracting validation properties from Yup schemas for form fields.

## Description

`yup-field-props-react` helps you extract form field validation properties in React applications using Yup schemas. It provides the `useFieldProps` hook and `SchemaProvider` component to easily integrate Yup schema definitions into your form components, maintaining the schema as the single source of truth. While similar functionality is possible with `yup` directly, this library significantly simplifies the process. For integration with `react-hook-form`, consider using [react-hook-form-yup](https://github.com/kfrankot/react-hook-form-yup), which is built on top of this library.

## Installation

Install the library using npm:

```bash
npm install yup-field-props-react
```

## useFieldProps Hook

Use the `useFieldProps` hook to extract validation properties from a schema field based on the current form values:

```typescript
import { useFieldProps } from 'yup-field-props-react'

const { min, max, integer, ...others } = useFieldProps('path.to.field')
```

## SchemaProvider Component

Use the `SchemaProvider` component to provide the validation schema and current form values to be used by `useFieldProps`:

```tsx
import { SchemaProvider } from 'yup-field-props-react'

const schema = yup.object().shape({
  /* define your schema */
})
const formValues = getFormValuesFromSomewhere()

return (
  <SchemaProvider schema={schema} values={formValues}>
    {children}
  </SchemaProvider>
)
```

## Basic Example

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
  // Get validation props from the schema with useFieldProps hook
  const { required, min, max, lessThan, moreThan } =
    useFieldProps<NumberFieldProps>(props.name || '')

  // Construct a placeholder message based on the validation props
  const minMsg = min ? `Min ${min}` : moreThan ? `More than ${moreThan}` : ''
  const maxMsg = max ? `Max ${max}` : lessThan ? `Less than ${lessThan}` : ''
  const placeholder = [minMsg, maxMsg].filter(Boolean).join(' and ')

  return (
    <input
      {...props}
      style={{ display: 'block', width: 250 }}
      // Set required prop based on the required prop from useFieldProps
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
    // Attach schema and form values to the SchemaProvider
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

## Advanced Example

For a more complex example using `@mui/material` and `react-hook-form`, see [examples/react-hook-form.tsx](examples/react-hook-form.tsx)
