import React from 'react'
import {Button, Tooltip, t, config, tooltipElement, defaultIcon, clearIcon as clearIconImg} from './base'
import {Text} from '@eitje/web_components'

export const RightContent = (props) => {
  const {icon = defaultIcon, onChange, clearIcon, defaultPickerValue} = props
  const hide = !icon && !clearIcon
  const rightElement = getRightElement(props)
  if (hide) return
  return (
    <config.Layout className="form-field-content-right">
      {icon && <img className="eitje-form-field-3-icon" src={icon} />}
      {clearIcon && <img className="eitje-form-field-3-clear-icon" src={clearIconImg} onClick={() => onChange(defaultPickerValue)} />}
      {rightElement}
    </config.Layout>
  )
}

const getRightElement = ({rightElement, ...rest}) => {
  if (!_.isString(rightElement)) return rightElement
  if (rightElement == 'charCounter') {
    return <CharCounter {...rest} />
  }
}

const makeCharClass = (charsLeft, {warningThreshold = 10, dangerThreshold = 5}) => {
  if (charsLeft < dangerThreshold) return 'eitje-form-3-char-counter-danger'
  if (charsLeft < warningThreshold) return 'eitje-form-3-char-counter-warning'
  return ''
}

const CharCounter = ({maxLength, value, ...rest}) => {
  const charsLeft = maxLength - (value?.length || 0)
  const className = makeCharClass(charsLeft, rest)
  return <Text className={`eitje-form-3-char-counter ${className}`}>{charsLeft}</Text>
}
