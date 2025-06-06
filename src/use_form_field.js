import React, {useState, isValidElement, useEffect, useRef} from 'react'
import {t, isScoped} from './base'
import _ from 'lodash'
import utils from '@eitje/utils'

const allowEmptyString = (...vals) => vals.find(v => v == '' || v)

function useFormField(props = {}) {
  let {
    required,
    disabled,
    error,
    disabledLabel,
    value,
    warning,
    defaultValue,
    labelVisible = true,
    formDisabled,
    formData,
    label,
    displayValue,
  } = props

  warning = utils.funcOrObj(warning, value, formData)
  const isDisabled = _.isFunction(disabled) ? disabled(formData) : disabled
  const isRequired = _.isFunction(required) ? required(formData) : required

  const actuallyDisabled = formDisabled || isDisabled

  let labelProps = isDisabled && disabledLabel ? {...props, label: disabledLabel} : props
  label = labelVisible ? buildDecoration({...labelProps, decorationType: 'label'}) : null
  let placeholder = buildDecoration({...props, decorationType: 'placeholder'})
  let extraLabel = buildDecoration({...props, decorationType: 'extraLabel'})
  let tooltip = buildDecoration({...props, decorationType: 'tooltip'})

  if (_.isString(label) || props.i18nOpts?.postProcess) label = <p className="eitje-form-2-label truncate">{label}</p>

  if (_.isString(extraLabel) || props.i18nOpts?.postProcess) extraLabel = <p className="eitje-form-2-extra-label">{extraLabel}</p>

  warning = warning && <p className="eitje-form-2-warning">{warning}</p>

  error = error && <p className="eitje-form-2-error">{error}</p>

  return {
    required: isRequired,
    error,
    disabled: actuallyDisabled,
    label,
    extraLabel,
    placeholder,
    warning,
    tooltip,
    value: allowEmptyString(displayValue, value, defaultValue),
  }
}

const decorationDefaults = {
  label: true,
  placeholder: true,
}

const buildDecoration = props => {
  const {decorationType} = props
  let val = props.hasOwnProperty(decorationType) ? props[decorationType] : decorationDefaults[decorationType]

  if (_.isFunction(val)) val = val(props)
  if (_.isBoolean(val)) return makeTranslation(props)
  return val
}

const numAtEndRegex = /-\d+\b/g // this is done for compositeField, because it suffixes fields with -number, like user_id-1

const makeTranslation = props => {
  let {label, decorationType, field, transNamespace} = props
  if (!transNamespace || !field) return

  field = field.replace(numAtEndRegex, '')

  const namespaces = utils.alwaysDefinedArray(transNamespace)
  const decorationName = utils.camelToSnake(decorationType)
  const opts = props.i18nOpts || {}

  let allKeys = namespaces.map(n => {
    return `form.${n}.fields.${field}.${decorationName}`
  })

  const lastOption = decorationType == 'placeholder' && '...'

  allKeys = [...allKeys, `form.defaults.fields.${field}.${decorationType}`, `records.default.fields.${field}`, lastOption].filter(Boolean)

  return t(allKeys, opts) // form.exportLayouts.fields.name.label|placeholder|extraLabel|tooltip
}

export default useFormField
