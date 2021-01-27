import React, { useState, useEffect, useRef } from 'react';
import {t, isScoped} from './base'
import _ from 'lodash'
import utils from '@eitje/utils'

const allowEmptyString = (...vals) => vals.find(v => v == "" || v)

function useFormField(props) {

  let {required, disabled, error, disabledLabel, name, value, warning, labelStyle = {}, extraLabelStyle = {}, extraLabel, errorStyle = {color: 'red'},
         defaultValue, labelVisible = true, formDisabled, formData, label, field, hidden, displayValue, warningStyle = {color: 'orange'} } = props
  warning = utils.funcOrObj(warning, value, formData)
  const isDisabled = _.isFunction(disabled) ? disabled(formData) : disabled
  const isRequired = _.isFunction(required) ? required(formData) : required

  const actuallyDisabled = formDisabled || isDisabled
  const lbl = findLabel(props)

  let finalLabel = !labelVisible ? null : isDisabled ? (disabledLabel || lbl) : lbl

  if(_.isString(finalLabel) ) {
    finalLabel = <p style={labelStyle}> {utils.capitalize( t(finalLabel) ) } </p>
  }

  if(_.isString(extraLabel)) {
    extraLabel = <p style={extraLabelStyle}> {t(extraLabel)} </p>
  }
  if(_.isFunction(extraLabel)) extraLabel = extraLabel(props)

  if(_.isFunction(finalLabel)) finalLabel = finalLabel(props)

  warning = warning && <p style={warningStyle}> {warning} </p>
  error = error && <p style={errorStyle}> {error} </p>

  
  return {required: isRequired, error, disabled: actuallyDisabled, label: finalLabel, extraLabel, warning, value: allowEmptyString(displayValue, value, defaultValue)}
}

const findLabel = ({label, name, field}) => {
  if(label) return label;
  const val = field
  const _name = 'field'
  if(!val) return;
  let finalValue = isScoped ? t(`form.${_name}.${val}`) : val;
  finalValue = finalValue == `form.${_name}.${val}` ? val : finalValue 
  return finalValue
}

export default useFormField


console.log("hiiii")