import React, { useEffect } from 'react'
import { useFieldValue, useFormSelector } from './context'

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
