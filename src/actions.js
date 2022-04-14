import React, {Fragment} from 'react'
import useFormField from './use_form_field'
import {Button, Tooltip, t, tooltipElement} from './base'
import utils from '@eitje/utils'
import {makeRegisteredField} from './use_register_field'

const decorateField =
  (Comp, {withLabel = true, withError = true, className = ''} = {}) =>
  (props) => {
    let {
      containerStyle = {},
      field,
      Container = 'div',
      isTouched,
      disabledStyle = {opacity: 0.2},
      containerProps = {},
      submitStrategy,
      submitForm,
      value,
      LeftContainer = Fragment,
      RightContainer = Fragment,
      rightChildren,
      leftChildren,
      leftContainerProps = {},
      rightContainerProps = {},
      readOnly,
      SubmitButton = Button,
      extraLabel,
      className: _className,
      isLayered = submitStrategy === 'inlineButton' || extraLabel,
      label,
      error,
      warning,
      disabled,
    } = props

    if (isLayered) {
      LeftContainer = RightContainer = 'div'
      leftContainerProps = {className: 'form-container-left'}
      rightContainerProps = {className: 'form-container-right'}
    }

    const isButtonSubmit = submitStrategy === 'inlineButton'

    const classNames = [
      `eitje-field-${field}`,
      error && 'error-msg-container',
      isLayered && 'form-container-split',
      readOnly && 'readOnly',
      _className,
    ]
      .filter(Boolean)
      .join(' ')

    let style = containerStyle
    if (disabled) style = {...disabledStyle, ...style}

    const _Comp = <Comp innerClass={classNames} {...props} />
    return (
      <Container className={`elementContainer ${classNames} ${className}`} style={style} {...containerProps}>
        <LeftContainer {...leftContainerProps}>
          {renderLabel({...props, label, withLabel})}
          {extraLabel}
          {leftChildren}
          {!extraLabel && _Comp}
          {withError && (error || warning)}
        </LeftContainer>

        <RightContainer {...rightContainerProps}>
          {extraLabel && _Comp}
          {rightChildren}
          {isButtonSubmit && isTouched && !error && (
            <div onClick={() => submitForm({field})}>
              <SubmitButton> {t('submit')} </SubmitButton>
            </div>
          )}
        </RightContainer>
      </Container>
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
