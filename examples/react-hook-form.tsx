/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Form,
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { Button, MenuItem, TextField, TextFieldProps } from '@mui/material'
// Replace this import with yup-field-props-react if you are copying this
// snippet from outside the examples
import { AllFieldProps, useFieldProps, SchemaProvider } from '../'
import { ReactNode, useMemo } from 'react'

// Define a yup schema
const schema = yup.object().shape({
  name: yup
    .string()
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),

  age: yup
    .number()
    .nullable()
    .required('Age is required')
    .min(13, 'Age must be at least 13')
    .max(65, 'Age must be at most 65')
    .integer('Age must be an integer'),

  email: yup
    .string()
    .email('Invalid email format')
    .when('age', ([age], schema) => {
      return age >= 18
        ? schema.required('Email is required for adults')
        : schema.notRequired()
    }),

  username: yup
    .string()
    .oneOf([yup.ref('name'), yup.ref('email')], 'Invalid username'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[@$!%*?&#]/,
      'Password must contain at least one special character',
    ),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),

  birthdate: yup
    .date()
    .nullable()
    .required('Birthdate is required')
    .min(new Date('1900-01-01'), 'Birthdate must be after 1900-01-01')
    .max(new Date(), 'Birthdate cannot be in the future'),

  address: yup.object().shape({
    street: yup.string().when('age', ([age], schema) => {
      return age >= 18
        ? schema.required('Street is required for adults')
        : schema.notRequired()
    }),
    city: yup.string(),
    zipCode: yup
      .string()
      .when(['city', 'street'], ([city, street], schema) => {
        return city && street
          ? schema.required('Zip Code is required')
          : schema.notRequired()
      })
      .matches(/^\d{5}$/, 'Zip Code must be exactly 5 digits'),
  }),

  phoneNumbers: yup
    .array()
    .of(
      yup
        .string()
        .length(yup.ref('$phoneNumberLength'), 'Phone number is wrong length'),
    )
    .min(1, 'At least one phone number is required')
    .max(3, 'At most three phone numbers are allowed'),

  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Invalid role')
    .required('Role is required'),

  adminCode: yup.string().when('role', ([role], schema) => {
    return role === 'admin'
      ? schema.required('Admin code is required for admins')
      : schema.notRequired()
  }),
})

const context = {
  phoneNumberLength: 10,
}

// Provide schema context
const YupSchemaProviderWithValues = ({ children }: { children: ReactNode }) => {
  const formContext = useFormContext()
  return (
    // values and context can be form state or function that gets form state
    <SchemaProvider
      schema={schema}
      values={formContext.getValues}
      context={context}
    >
      {children}
    </SchemaProvider>
  )
}

// Map results from useFieldProps to TextField Props
const yupPropsToInputProps = (
  yupProps: AllFieldProps,
  value: any,
): Partial<TextFieldProps> => {
  const inputProps: Partial<TextFieldProps> = {}
  inputProps.required = yupProps.required
  if (yupProps.oneOf.length) {
    inputProps.helperText = `One of: ${yupProps.oneOf.join(', ')}`
  }
  if (yupProps.type === 'string') {
    if (yupProps.max) {
      inputProps.helperText = `${value.length} / ${yupProps.max}`
    }
    if (yupProps.length) {
      inputProps.helperText = `Should be length: ${yupProps.length}`
    }
  }
  if (yupProps.type === 'number' || yupProps.type === 'array') {
    if (
      (yupProps.min || yupProps.moreThan) &&
      (yupProps.max || yupProps.lessThan)
    ) {
      inputProps.placeholder = `${yupProps.min ?? yupProps.moreThan} - ${yupProps.max ?? yupProps.lessThan}`
    } else if (yupProps.min) {
      inputProps.placeholder = `>= ${yupProps.min}`
    } else if (yupProps.max) {
      inputProps.placeholder = `<= ${yupProps.max}`
    } else if (yupProps.moreThan) {
      inputProps.placeholder = `> ${yupProps.moreThan}`
    } else if (yupProps.lessThan) {
      inputProps.placeholder = `< ${yupProps.lessThan}`
    }
  }
  if (yupProps.type === 'date') {
    if (yupProps.min && yupProps.max) {
      inputProps.placeholder = `${yupProps.min.toDateString()} - ${yupProps.max.toDateString()}`
    } else if (yupProps.min) {
      inputProps.placeholder = `>= ${yupProps.min.toDateString()}`
    } else if (yupProps.max) {
      inputProps.placeholder = `<= ${yupProps.max.toDateString()}`
    }
  }
  return inputProps
}

const ControlledTextField = ({
  name,
  label,
  type = 'text',
  options,
}: {
  name: string
  label: string
  type?: string
  options?: string[]
}) => {
  // Get yup field props and react-hook-form props by name
  const { forceFormUpdate, ...yupProps } = useFieldProps(name)
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({ name })
  const otherProps = {
    helperText: isTouched && error?.message,
  }
  if (!otherProps.helperText) {
    delete otherProps.helperText
  }

  return (
    <TextField
      {...field}
      onBlur={() => {
        field.onBlur()
        // forceFormUpdate guarantees that field props updated to match rhf state,
        // as rhf is very touchy about re-renders.  Also forceFieldUpdate is available
        // for individual fields if you don't want to re-render the whole form
        forceFormUpdate()
      }}
      {...yupPropsToInputProps(yupProps, field.value)}
      label={label}
      type={type}
      error={!!error && isTouched}
      fullWidth
      margin="normal"
      select={!!options}
      value={field.value ?? ''}
      {...otherProps}
    >
      {options?.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

const MyForm = () => {
  const resolver = useMemo(() => yupResolver(schema), [schema])
  const formProviderProps = useForm({
    mode: 'all',
    resolver,
    context,
    defaultValues: {
      name: '',
      age: null,
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: null,
      address: {
        street: '',
        city: '',
        zipCode: '',
      },
      phoneNumbers: ['', '', ''],
      terms: false,
      role: 'user',
      adminCode: '',
    } as any,
  })

  const onSubmit = ({ data }: { data: any }) => {
    console.log(data)
  }

  return (
    <FormProvider {...formProviderProps}>
      <Form onSubmit={onSubmit}>
        <YupSchemaProviderWithValues>
          <ControlledTextField name="name" label="Name" />
          <ControlledTextField name="age" label="Age" type="number" />
          <ControlledTextField name="email" label="Email" />
          <ControlledTextField name="username" label="Username" />
          <ControlledTextField
            name="password"
            label="Password"
            type="password"
          />
          <ControlledTextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />
          <ControlledTextField name="birthdate" label="Birthdate" />
          <ControlledTextField name="address.street" label="Street" />
          <ControlledTextField name="address.city" label="City" />
          <ControlledTextField name="address.zipCode" label="Zip Code" />
          <ControlledTextField name="phoneNumbers.0" label="Phone Number 1" />
          <ControlledTextField name="phoneNumbers.1" label="Phone Number 2" />
          <ControlledTextField name="phoneNumbers.2" label="Phone Number 3" />
          <ControlledTextField
            name="role"
            label="Role"
            options={['user', 'admin']}
          />
          <ControlledTextField name="adminCode" label="Admin Code" />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </YupSchemaProviderWithValues>
      </Form>
    </FormProvider>
  )
}

export default MyForm
/* eslint-enable @typescript-eslint/no-explicit-any */
