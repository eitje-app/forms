import _ from 'lodash'
import React, {useContext, Component, useState, Fragment, PropTypes, useRef, createRef} from 'react'
import utils from '@eitje/utils'
import {t, Button, Prompt, Wrapper, alert} from './base'
import {debounce} from './utils'
import {Provider, useForm} from './context'

const noop = () => {}
const trailingDot = /\.$/g

const parseValidObj = (validObj, defaultMessage) => {
  if (_.isPlainObject(validObj)) {
    const {message} = validObj
    if (message) validObj.message = `form.validation.${message}`
    return validObj
  }
  if (_.isString(validObj)) return {message: validObj, valid: false}
  if (_.isBoolean(validObj)) return {valid: validObj, message: defaultMessage}

  return {valid: true}
}

export class NewForm extends Component {
  constructor(props) {
    const {debounceTime = 1000, throttleTime = 500} = props
    const fields = props.initialValues && _.isObject(props.initialValues) ? _.cloneDeep(props.initialValues) : {}
    super(props)
    this.state = {
      loading: false,
      touchedFields: [],
      errors: {},
      registeredFields: [],
      fields,
    }
    this.resetValues = this.resetValues.bind(this)
    this.submit = this.submit.bind(this)
    this.updateField = this.updateField.bind(this)
    this.handleOtherFieldErrors = this.handleOtherFieldErrors.bind(this)
    this.registerField = this.registerField.bind(this)
    this.getValue = this.getValue.bind(this)
    this.enhanceField = this.enhanceField.bind(this)
    this.unregisterField = this.unregisterField.bind(this)
    this.touchedAndFilled = this.touchedAndFilled.bind(this)
    this.throttledSubmit = _.debounce(this.submit, throttleTime, {trailing: true})
    this.submit = debounce(this.submit, debounceTime, true)
  }

  getParams = () => this.state.fields

  fieldNames = () => utils.alwaysDefinedArray(this.state.registeredFields).map(f => f.fieldName)

  setErrors = newErrors => this.setState({errors: {...this.state.errors, ...newErrors}})

  async submit({field, onlyTouched, skipAfterSubmit, namespace} = {}) {
    const {setErrors} = this
    const {onSubmit, submitInitialValues, initialValues, identityField = 'id'} = this.props
    const {fields, touchedFields, submitting} = this.state

    if (submitting) return false

    let params, toPick

    if (submitInitialValues) {
      params = fields
    } else if (field) {
      toPick = [field, identityField]
    } else if (onlyTouched) {
      toPick = [...touchedFields, identityField]
    } else {
      toPick = [...this.fieldNames(), identityField]
    }

    if (!params) params = _.pick(fields, toPick)

    params = _.pickBy(params, (val, key) => !key.startsWith('arrayField--zz--'))

    console.group('FORM')
    console.log('Start validation')
    if (this.validate({fields: [field].filter(Boolean)})) {
      console.log('Params to be submitted', params)

      let res
      this.setState({submitting: true})
      try {
        res = await onSubmit(params, {setErrors, fields})
      } finally {
        this.setState({submitting: false})
      }

      if (!res) return
      const resIsOk = (_.isPlainObject(res) && res.ok) || res == true
      if (resIsOk) {
        const partialSubmit = !!field
        const unchangedTouchedFields = touchedFields.filter(f => _.isEqual(this.state.fields[f], params[f]))
        !skipAfterSubmit && this.afterSubmit({params, res, initialValues, touchedFields: unchangedTouchedFields, partialSubmit})
      } else {
        if (res?.data?.errors) this.handleErrors(res)
      }
    }

    console.groupEnd()
  }

  handleErrors(res) {
    const {fields} = this.state
    let errors = res.data?.errors
    if (_.isString(errors)) errors = {base: [errors]}
    if (!_.isObject(errors)) return
    const newErrors = _.mapValues(errors, err => err[0])
    this.setState({errors: {...this.state.errors, ...newErrors}})
  }

  unTouch(fields) {
    const touchedFields = fields ? this.state.touchedFields.filter(f => !fields.includes(f)) : []
    this.setState({touchedFields, touched: false})
  }

  async afterSubmit({params, res, ...rest}) {
    const {afterSubmit = () => {}, resetAfterSubmit} = this.props
    await this.unTouch(rest.touchedFields)
    afterSubmit({params, res, resData: res?.data, ...rest})
    if (resetAfterSubmit) this.resetValues()
  }

  componentDidUpdate(prevProps, prevState) {
    const {overrideInitialValues} = this.props

    if (!_.isEqual(prevProps.initialValues, this.props.initialValues)) {
      if (overrideInitialValues) {
        const overrideStyle = overrideInitialValues == 'hard' ? 'hard' : 'soft'
        overrideStyle == 'soft'
          ? this.setState({fields: {...this.state.fields, ...this.props.initialValues}})
          : this.setState({fields: this.props.initialValues})
      } else {
        this.updateUnTouchedFields(this.props.initialValues)
      }
    }
  }

  updateUnTouchedFields = newVals => {
    const {touchedFields} = this.state
    const toBeUpdated = _.pickBy(newVals, (val, key) => !touchedFields.includes(key))
    const newFields = {...this.state.fields, ...toBeUpdated}
    this.setState({fields: newFields})
  }

  handleOtherFieldErrors = field => {
    const {errors, registeredFields} = this.state
    const errFields = Object.keys(errors).filter(e => errors[e] && errors[e] != t('form.required'))
    errFields.forEach(errField => {
      const registeredField = registeredFields.find(f => f.fieldName == errField)

      if (registeredField) this.validateField(errField, true, registeredField?.props)
    })
  }

  updateField = async (field, val, fieldProps = {}) => {
    const {fields, errors, touched, touchedFields} = this.state
    const {namespace} = fieldProps

    let newFields = {...this.state.fields}

    if (newFields[field] === val) return

    newFields[field] = val
    await this.setState({fields: newFields})
    if (errors[field]) this.validateField(field, true, fieldProps)
    this.handleOtherFieldErrors(field)

    if (!touchedFields.includes(field)) {
      this.setState({touchedFields: [...touchedFields, field]})
    }

    if (!touched) {
      this.setState({touched: true})
    }

    if (fieldProps.submitStrategy === 'throttledChange') {
      this.throttledSubmit({onlyTouched: true, namespace})
    }

    if (fieldProps.submitStrategy === 'change') {
      this.submit({field, namespace})
    }
  }

  handleRequired(required, val) {
    return _.isFunction(required) ? required(this.state.fields) : required
    // required fields not being filled is only an issue when a user really submits a form, not when they're typing
  }

  validateField(field, direct = false, fieldProps, {checkRequired} = {}) {
    const {fields, errors} = this.state
    const {validate, required} = fieldProps
    const value = this.getValue(field, fieldProps)
    let error = null
    let valid
    const isReq = checkRequired && this.handleRequired(required)

    if (isReq) error = !utils.exists(value) && t('form.required')

    if (validate && !error) {
      const validateResult = validate(value, {fieldProps, getFormData: this.getParams})
      const validObj = parseValidObj(validateResult, 'form.invalid')
      const {valid, message} = validObj
      if (!valid) error = t(message)
    }

    const newErrors = {...errors, [field]: error}
    direct && this.setState({errors: newErrors})
    return error // also possible to return errs instead of writing to state
  }

  validateInner({fields = []} = {}) {
    const {errors, registeredFields} = this.state
    let errs = {}
    let invalid
    const hasSpecificFields = fields.length > 0

    registeredFields.forEach(f => {
      const {props, fieldName} = f
      let error
      if (hasSpecificFields && !fields.includes(fieldName)) return
      error = this.validateField(fieldName, false, this.makeProps(props), {checkRequired: true})

      errs[fieldName] = error

      if (!invalid && error) {
        invalid = true
      }
    })
    return {invalid, errs}
  }

  validate({fields = []} = {}) {
    const {invalid, errs} = this.validateInner({fields})
    this.setState({errors: errs})
    return !invalid
  }

  resetValues = empty => {
    const newState = empty ? {} : this.props.initialValues
    this.setState({fields: newState})
  }

  removeValues = keys => {
    this.setState(state => ({fields: _.omit(state.fields, keys)}))
  }

  setValues = obj => {
    this.setState(prev => ({fields: {...prev.fields, ...obj}}))
  }

  getValue = (field, props = {}) => {
    const {fields = {}} = this.state
    return fields[field]
  }

  getImperativeFieldProps = props => {
    const impProps = {}
    const {useSubmitStrategy} = this.props
    if (!props.submitStrategy && useSubmitStrategy) {
      impProps['submitStrategy'] = props.defaultSubmitStrategy || 'change'
    }
    return impProps
  }

  makeProps = (props, extraProps = {}) => {
    const {fieldProps} = this.props
    const {fields} = this.state

    const fieldPropsToMerge = utils.funcOrVal(props?.ignoreFieldProps, fields) ? {} : fieldProps
    const imperativeProps = this.getImperativeFieldProps(props)
    return Object.assign({}, extraProps, fieldPropsToMerge, imperativeProps, props)
  }

  enhanceField(field, _fieldProps) {
    const {updatedFields = [], disabledFields = [], disabled, onSubmit, name} = this.props
    const {errors, fields, registeredFields, touchedFields} = this.state
    let condOpts = {}
    const fieldProps = this.makeProps(_fieldProps)
    const {submitStrategy} = fieldProps
    const action = () => touchedFields.includes(field) && this.submit({field})
    const index = registeredFields.findIndex(f => f.fieldName == field)
    if (submitStrategy === 'blur') condOpts['onBlur'] = action
    const value = this.getValue(field, fieldProps)
    return {
      formData: fields,
      disabled: disabledFields.includes(field),
      isTouched: touchedFields.includes(field),
      error: errors[field],
      ...condOpts,
      ...fieldProps,
      onChange: val => this.updateField(field, val, fieldProps),
      isFirst: index == 0,
      value,
      name,
    }
  }

  touchedAndFilled() {
    const {initialValues = {}} = this.props
    const {touched, touchedFields, fields = {}} = this.state
    return touched && touchedFields.some(s => !_.isEqual(fields[s], initialValues[s]))
  }

  getContext() {
    const {submit, setValues, removeValues, resetValues, validate, getParams, registerField, enhanceField, unregisterField} = this
    const {errors, touchedFields} = this.state

    return {
      removeValues,
      errors,
      submit,
      resetValues,
      setValues,
      validate,
      getData: getParams,
      enhanceField,
      registerField,
      unregisterField,
      touchedFields,
      form: this,
    }
  }

  registerField(fieldName, props) {
    const obj = {fieldName, props}
    this.setState(state => ({registeredFields: [...state.registeredFields, obj]}))
  }

  unregisterField(fieldName) {
    this.setState(state => ({
      registeredFields: state.registeredFields.filter(f => f.fieldName != fieldName),
    }))
  }

  render() {
    const {
      children,
      onSubmit,
      submitOnEnter = true,
      hidePrompt,
      promptMsg = 'leave_unfinished_form',
      variant = 'grid',
      className,
    } = this.props
    const {errors, fields, touchedFields} = this.state
    const classNames = utils.makeCns(className, 'eitje-form-3', `eitje-form-3-${variant}`)
    return (
      <Fragment>
        <Wrapper
          action="javascript:" // This is needed to prevent nested forms from reloading the page on enter.. dont ask me why
          onSubmit={e => {
            e.preventDefault()
            onSubmit && submitOnEnter && this.submit()
          }}
          autocomplete="nope"
          className={classNames}
          tabIndex={-1}
        >
          <Provider value={this.getContext()}>{children}</Provider>
        </Wrapper>
        {!hidePrompt && this.touchedAndFilled() && Prompt && (
          <Prompt message={(loc, act, previousLoc) => handlePrompt(loc, previousLoc, promptMsg, this)} />
        )}
      </Fragment>
    )
  }
}

const handlePrompt = (nextLoc, initialLoc, promptMsg, form) => {
  const {pathname} = nextLoc
  if (pageStaysVisible(nextLoc, initialLoc)) return true
  return t(promptMsg)
}

const pageStaysVisible = (nextLoc, initialLoc) => {
  if (nextLoc?.pathname == initialLoc?.pathname) return true
  if (nextLoc?.state?.background?.pathname == initialLoc?.pathname) return true
}

export default NewForm
