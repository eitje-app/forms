import {createContext, useContext, useContextSelector} from 'use-context-selector'

const FormContext = createContext({})
export const {Provider} = FormContext

export const useForm = () => {
  return useContext(FormContext)
}

export const useFormSelector = key => {
  return useContextSelector(FormContext, ctx => _.get(ctx, key))
}

export const useFieldValue = field => {
  return useFormSelector(`fields.${field}`)
}
