import React, {Fragment} from 'react'
import useFormField from './use_form_field'
import {Button, Tooltip, t, tooltipElement, defaultIcon, clearIcon} from './base'
import utils from '@eitje/utils'
import {makeRegisteredField} from './use_register_field'

const decorateField =
  (Comp, {withLabel = true, extraChildren, withIcon = true, withError = true, className = ''} = {}) =>
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

    const classNames = [
      `eitje-form-2-field-${field}`,
      disabled && 'eitje-form-2-field-disabled',
      error && 'eitje-form-2-field-error',
      readOnly && 'eitje-form-2-read-only',
      _className,
    ]
      .filter(Boolean)
      .join(' ')

    const _Comp = <Comp innerClass={classNames} {...props} />
    return (
      <div className={`eitje-form-2-field ${classNames} ${className}`}>
        {renderLabel({...props, label, withLabel})}
        {extraLabel}
        {!extraLabel && _Comp}
        {withError && (error || warning)}

        {isButtonSubmit && isTouched && !error && (
          <div onClick={() => submitForm({field})}>
            <SubmitButton> {t('submit')} </SubmitButton>
          </div>
        )}

        {withIcon && icon && _.isString(icon) && <img className="eitje-form-2-field-icon" src={icon} />}
        {withIcon && clearIcon && <img className="eitje-form-2-field-clear" src={clearIcon} onClick={() => onChange(null)} />}
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
  const Formified = decorateField(Comp)
  return makeRegisteredField(Formified, compOpts)
}
