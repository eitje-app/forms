import {createContext, useContext} from 'react'

const FormContext = createContext({})
export const {Provider} = FormContext
export const useForm = () => {
	return useContext(FormContext)
}
