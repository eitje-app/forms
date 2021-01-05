import React, { useState, useEffect, useRef } from 'react';
import {t, isScoped} from './base'
import _ from 'lodash'

function useFormField(props) {

  let {required, disabled, error, disabledLabel, name, value, labelStyle = {} ,
         defaultValue, labelVisible = true, formDisabled, formData, label, field} = props

  const isDisabled = _.isFunction(disabled) ? disabled(formData) : disabled
  const isRequired = _.isFunction(required) ? required(formData) : required

  const actuallyDisabled = formDisabled || isDisabled
  const lbl = findLabel(props)

  let finalLabel = !labelVisible ? null : isDisabled ? (disabledLabel || lbl) : lbl

  if(finalLabel && _.isString(finalLabel) ) {
    finalLabel = <p style={labelStyle}> {finalLabel}: </p>
  }

  if(_.isFunction(finalLabel)) finalLabel = finalLabel(props)


  error = error && <p style={{color: 'red'}}> {error} </p>

  
  return {required: isRequired, error, disabled: actuallyDisabled, label: finalLabel, value: value || defaultValue}

}


const findLabel = ({label, name, field}) => {
  if(label) return label;
  const val = name || field
  const _name = name ? 'name' : 'field'
  if(!val) return;

  const finalValue = isScoped ? t(`form.${_name}.${val}`) : val;
  return finalValue == `form.${_name}.${val}` ? val : finalValue 
}

export default useFormField


console.log("hiiii")