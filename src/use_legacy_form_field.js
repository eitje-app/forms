import React, {useState, useEffect, useRef} from 'react'
import {t, isScoped} from './base'
import _ from 'lodash'
import utils from '@eitje/utils'

const allowEmptyString = (...vals) => vals.find((v) => v == '' || v)

function useFormField(props = {}) {
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
  const lbl = findLabel(props)
  let finalLabel = !labelVisible ? null : isDisabled ? disabledLabel || lbl : lbl

  if (_.isString(finalLabel)) {
    finalLabel = (
      <p className="eitje-label" style={labelStyle}>
        {utils.capitalize(t(finalLabel))}
      </p>
    )
  }

  if (_.isString(extraLabel)) {
    extraLabel = (
      <p className="eitje-extra-label" style={extraLabelStyle}>
        {t(extraLabel)}
      </p>
    )
  }

  if (_.isFunction(extraLabel)) {
    extraLabel = extraLabel(props)
    if (_.isString(extraLabel)) {
      extraLabel = (
        <p className="eitje-label" style={extraLabelStyle}>
          {extraLabel}
        </p>
      )
    }
  }

  if (_.isFunction(finalLabel)) {
    finalLabel = finalLabel(props)
    if (_.isString(finalLabel)) {
      finalLabel = (
        <p className="eitje-label" style={labelStyle}>
          {finalLabel}
        </p>
      )
    }
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

  return {
    required: isRequired,
    error,
    disabled: actuallyDisabled,
    label: finalLabel,
    extraLabel,
    warning,
    value: allowEmptyString(displayValue, value, defaultValue),
  }
}

const makeTranslation = (props) => {
  const {label, decorationType = 'label', field, transNamespace} = props
  if (!transNamespace) return
  return t(`form.${transNamespace}.${decorationType}.${field}`) // form.exportLayouts.labels.name
}

const findLabel = (props) => {
  const {label, name, field} = props
  if (_.isBoolean(label) && field && isScoped) return makeTranslation(props)
  if (label) return label
  const val = field
  const _name = 'field'
  if (!val) return
  let finalValue = isScoped ? t(`form.${_name}.${val}`) : val
  finalValue = finalValue == `form.${_name}.${val}` ? val : finalValue
  return finalValue
}

export default useFormField
