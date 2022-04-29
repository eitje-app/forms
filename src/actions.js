import React, {Fragment} from 'react'
import useFormField from './use_form_field'
import {Button, Tooltip, t, tooltipElement, defaultIcon, clearIcon} from './base'
import utils from '@eitje/utils'
import {makeRegisteredField} from './use_register_field'

function fireMouseEvents(element, eventNames = ['mousedown']) {
  // we stole this from SO to emulate mousedown/other non-click mouse events
  if (element && eventNames && eventNames.length) {
    for (var index in eventNames) {
      var eventName = eventNames[index]
      if (element.fireEvent) {
        element.fireEvent('on' + eventName)
      } else {
        var eventObject = document.createEvent('MouseEvents')
        eventObject.initEvent(eventName, true, false)
        element.dispatchEvent(eventObject)
      }
    }
  }
}

const findDropdown = (element) => {
  const child = element.querySelector('.ant-select-selector')
  if (!child) return
  fireMouseEvents(child)
}

const findInput = (element) => {
  let child = element.querySelector('input') // for now, we assume the 'actual' input is always an input AND there is always only one
  child?.focus()
}

const findFns = {
  'eitje-dropdown-container': findDropdown,
  'eitje-input-container': findInput,
}

const decorateField =
  (Comp, {withLabel = true, extraChildren, withIcon = true, withClearIcon, withError = true, className = ''} = {}) =>
  (props) => {
    let {
      field,
      isTouched,
      submitStrategy,
      submitForm,
      value,
      readOnly,
      SubmitButton = Button,
      extraLabel,
      className: _className,
      label,
      error,
      warning,
      disabled,
      onChange,
      icon = defaultIcon,
    } = props

    const isButtonSubmit = submitStrategy === 'inlineButton'

    const classNames = utils.makeCns(
      `eitje-form-2-field `,
      `eitje-form-2-field-${field}`,
      disabled && 'eitje-form-2-field-disabled',
      error && 'eitje-form-2-field-error',
      readOnly && 'eitje-form-2-read-only',
      _className,
      className,
    )

    const _Comp = <Comp innerClass={classNames} {...props} />

    const clickChild = (e) => {
      const element = e.target.classList.contains('eitje-form-2-field') ? e.target : e.target.parentElement
      if (!element) return
      findFns[className]?.(element)
    }

    return (
      <div onClick={clickChild} className={classNames}>
        {renderLabel({...props, label, withLabel})}
        {extraLabel}
        {_Comp}
        {withError && (error || warning)}

        {isButtonSubmit && isTouched && !error && (
          <div onClick={() => submitForm({field})}>
            <SubmitButton> {t('submit')} </SubmitButton>
          </div>
        )}

        {withIcon && icon && _.isString(icon) && <img className="eitje-form-2-field-icon" src={icon} />}
        {clearIcon && withClearIcon && <img className="eitje-form-2-field-clear" src={clearIcon} onClick={() => onChange(null)} />}
      </div>
    )
  }

const renderError = ({error, warning}) => {}

const renderLabel = ({label, withLabel, tooltip}) => {
  if (!withLabel || !label) return null
  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        {label}
        {tooltipElement}
      </Tooltip>
    )
  }
  return label
}

export const makeField = (Comp, compOpts = {}) => {
  const Formified = decorateField(Comp, compOpts)
  return makeRegisteredField(Formified, compOpts)
}
