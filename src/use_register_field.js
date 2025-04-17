import React, {useEffect} from 'react'
import {useForm} from './context_form'
import {useFieldValue, useFormSelector} from './context'
import useFormField from './use_form_field'

export const useRegisterField = (field, fieldProps) => {
  const {registerField = _.noop, enhanceField = _.noop, unregisterField = _.noop} = useForm()
  useEffect(() => {
    registerField(field, fieldProps)
    return () => unregisterField(field)
  }, [field])
  return enhanceField(field, fieldProps)
}

export const makeRegisteredField = Comp => props => {
  const formProps = useRegisterField(props.field, props)
  const formFieldProps = useFormField(formProps)
  return <Comp {...props} {...formProps} {...formFieldProps} form />
}

export const useNewRegisterField = (field, fieldProps) => {
  const registerField = useFormSelector('registerField')
  const unregisterField = useFormSelector('unregisterField')
  const enhanceField = useFormSelector('enhanceField')

  useEffect(() => {
    registerField(field, fieldProps)
    return () => unregisterField(field)
  }, [field])

  const value = useFieldValue(field)
  const error = useFormSelector(`errors.${field}`)

  return enhanceField(field, {...fieldProps, value, error})
}

export const makeNewRegisteredField = Comp => props => {
  const formProps = useNewRegisterField(props.field, props)
  return <Comp {...props} {...formProps} form />
}
