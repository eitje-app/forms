import React, {Fragment, useState} from 'react'
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

const ignoreDropdownClasses = ['eitje-form-2-select-all', 'eitje-form-2-field-clear', 'ant-select-selector']

let dropdownIsOpen = false

const findDropdown = (e, props) => {
  if (ignoreDropdownClasses.some((c) => e.target.classList.contains(c))) return
  const element = e.target.classList.contains('eitje-form-2-field') ? e.target : e.target.parentElement

  const child = element.querySelector('.ant-select-selector')
  if (!child) return
  if (!dropdownIsOpen) {
    fireMouseEvents(child)
  }
}

const findInput = (e) => {
  const element = e.target.classList.contains('eitje-form-2-field') ? e.target : e.target.parentElement
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
    const setOpen = (open) => {
      // this is only for dropdown, if you click outside antd's area, they trigger a 'clickOutside' event and hide the dropdown menu.
      // sadly, this event is fired BEFORE our click, and thus we never know if the dropdown ACTUALLY came from a closed state, or if it was just closed by the clickOutside event
      // the 200ms here is a proxy to differentiate between 'actually closed' & 'just closed by event trigger'
      setTimeout(() => {
        dropdownIsOpen = open
      }, 200)
    }

    const isButtonSubmit = submitStrategy === 'inlineButton'
    withClearIcon = utils.funcOrVal(withClearIcon, props)
    withIcon = utils.funcOrVal(withIcon, props)

    const classNames = utils.makeCns(
      `eitje-form-2-field `,
      `eitje-form-2-field-${field}`,
      disabled && 'eitje-form-2-field-disabled',
      error && 'eitje-form-2-field-error',
      readOnly && 'eitje-form-2-read-only',
      withIcon && 'eitje-form-2-field-has-icon',
      withClearIcon && 'eitje-form-2-field-has-clear-icon',
      _className,
      className,
    )

    const clickChild = (e) => {
      findFns[className]?.(e, props)
    }

    return (
      <div onClick={clickChild} className={classNames}>
        {renderLabel({...props, label, withLabel})}
        {extraLabel}
        <Comp setOpen={setOpen} {...props} />
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
