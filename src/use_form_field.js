import React, {useState, useEffect, useRef} from 'react'
import {t, isScoped} from './base'
import _ from 'lodash'
import utils from '@eitje/utils'

const allowEmptyString = (...vals) => vals.find((v) => v == '' || v)

function useFormField(props) {
  let {
    required,
    disabled,
    error,
    disabledLabel,
    name,
    value,
    warning,
    labelStyle = {},
    extraLabelStyle = {},
    extraLabel,
    errorStyle = {color: 'red'},
    defaultValue,
    labelVisible = true,
    formDisabled,
    formData,
    label,
    field,
    hidden,
    displayValue,
    warningStyle = {color: 'orange'},
  } = props
  warning = utils.funcOrObj(warning, value, formData)
  const isDisabled = _.isFunction(disabled) ? disabled(formData) : disabled
  const isRequired = _.isFunction(required) ? required(formData) : required

  const actuallyDisabled = formDisabled || isDisabled

  const mainLabel = findDecoration({...props, decorationType: 'label'})
  let subLabel = findDecoration({...props, decorationType: 'extraLabel'})
  const placeholder = _.isBoolean(placeholder) && findDecoration({...props, decorationType: 'placeholder'})

  const lbl = findLabel(props)

  let finalLabel = !labelVisible ? null : isDisabled ? disabledLabel || mainLabel : mainLabel

  if (_.isString(mainLabel)) {
    finalLabel = (
      <p className="eitje-label" style={labelStyle}>
        {utils.capitalize(finalLabel)}
      </p>
    )
  }

  if (_.isString(subLabel)) {
    subLabel = (
      <p className="eitje-extra-label" style={extraLabelStyle}>
        {subLabel}
      </p>
    )
  }

  warning = warning && (
    <p className="warning-msg" style={warningStyle}>
      {warning}
    </p>
  )
  error = error && (
    <p className="error-msg" style={errorStyle}>
      {error}
    </p>
  )

  debugger

  let obj = {
    required: isRequired,
    error,
    disabled: actuallyDisabled,
    label: finalLabel,
    extraLabel: subLabel,
    warning,
    value: allowEmptyString(displayValue, value, defaultValue),
  }
  if (placeholder) obj['placeholder'] = placeholder
  return obj
}

// [label, extraLabel, placeholder]

const findDecoration = (props) => {
  let {field, decorationType, ...rest} = props
  let value = props[decorationType]
  if (_.isFunction(value)) return value(rest)
  if (_.isBoolean(value) && field) return makeTranslation({...props, value})
  return decorationType == 'label' ? t(findLabel(props)) : null
}

const makeTranslation = (props) => {
  const {value, decorationType, field, transNamespace} = props
  if (!transNamespace) return
  return t(`form.${transNamespace}.${decorationType}.${field}`) // form.exportLayouts.labels.name
}

const findLabel = ({label, name, field}) => {
  if (label) return label
  const val = field
  const _name = 'field'
  if (!val) return
  let finalValue = isScoped ? t(`form.${_name}.${val}`) : val
  finalValue = finalValue == `form.${_name}.${val}` ? val : finalValue
  return finalValue
}

export default useFormField
