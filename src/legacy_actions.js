import React, {Fragment} from 'react'
import useFormField from './use_legacy_form_field'
import {Button, Tooltip, t} from './base'
import utils from '@eitje/utils'

export const makeLegacyField =
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
    } = props

    if (isLayered) {
      LeftContainer = RightContainer = 'div'
      leftContainerProps = {className: 'form-container-left'}
      rightContainerProps = {className: 'form-container-right'}
    }

    const isButtonSubmit = submitStrategy === 'inlineButton'

    const prupz = useFormField(props)
    let {label, error, warning, disabled} = prupz
    extraLabel = prupz.extraLabel
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

    const _Comp = <Comp innerClass={classNames} {...props} {...prupz} />
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

const renderLabel = ({label, withLabel, info}) => {
  if (!withLabel || !label) return null
  if (info) {
    return <Tooltip title={info}>{label}</Tooltip>
  }
  return label
}
