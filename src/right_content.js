import React, {Fragment} from 'react'
import {Button, Tooltip, t, config, tooltipElement, defaultIcon, clearIcon as clearIconImg} from './base'
import {Text, Icon, PopoutCard} from '@eitje/web_components'

export const RightContent = props => {
  const rightElement = getRightElement(props)
  const iconProps = getIcon(props)
  if (!iconProps && !rightElement) return null
  const {Wrapper = Fragment, wrapperProps, ...iconRest} = iconProps || {}
  return (
    <config.Layout className="form-field-content-right">
      {rightElement}
      {iconProps && (
        <Wrapper {...wrapperProps}>
          <Icon size={12} {...iconRest} />
        </Wrapper>
      )}
    </config.Layout>
  )
}

const getIcon = ({readOnly, disabled, value, onChange, icon, defaultPickerValue, clearIcon = true}) => {
  if (disabled) return
  if (readOnly) return {name: 'locked', Wrapper: PopoutCard, wrapperProps: {title: t('form.general.tooltips.read_only')}}
  if (clearIcon && value) return {name: 'cross', className: 'cross-icon', onClick: () => onChange(defaultPickerValue)}
  if (icon) return {name: 'caret-down'}
}

const getRightElement = ({rightElement, ...rest}) => {
  if (!_.isString(rightElement)) return rightElement
  if (rightElement == 'charCounter') {
    return <CharCounter {...rest} />
  }
}

const CharCounter = ({maxLength, value, ...rest}) => {
  const charsLeft = maxLength - (value?.length || 0)
  return <Text>{charsLeft}</Text>
}
