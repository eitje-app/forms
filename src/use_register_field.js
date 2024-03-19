import React, {useState, useEffect, useRef} from 'react'
import {t, isScoped} from './base'
import _ from 'lodash'
import utils from '@eitje/utils'
import {useForm} from './context_form'
import useFormField from './use_form_field'

export const useRegisterField = (field, fieldProps) => {
	const {registerField = _.noop, enhanceField = _.noop, unregisterField = _.noop} = useForm()
	useEffect(() => {
		registerField(field, fieldProps)
		return () => unregisterField(field)
	}, [])

	return enhanceField(field, fieldProps)
}

export const makeRegisteredField = (Comp) => (props) => {
	const formProps = useRegisterField(props.field, props)
	const formFieldProps = useFormField(formProps)
	return <Comp {...props} {...formProps} {...formFieldProps} form />
}

export const makeNewRegisteredField = (Comp) => (props) => {
	const formProps = useRegisterField(props.field, props)
	return <Comp {...props} {...formProps} form />
}
