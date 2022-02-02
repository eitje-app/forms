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

	const formProps = enhanceField(field, fieldProps)

	const formFieldProps = useFormField(formProps)

	return {...formProps, ...formFieldProps}
}

export const makeRegisteredField = (Comp) => (props) => {
	const formProps = useRegisterField(props.field, props)
	return <Comp {...props} {...formProps} />
}
