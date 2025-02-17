import React, {Fragment} from 'react'
import {Button, Tooltip, t, config, tooltipElement, defaultIcon, clearIcon as clearIconImg} from './base'
import {Text, Icon, PopoutCard} from './circular_dependency_fix'
import utils from '@eitje/web_utils'
import {FieldInput} from './field_input'

export const RightContent = props => {
  const {Comp, inputPosition} = props
  const rightElement = getRightElement(props)
  const icons = utils.alwaysArray(getIcon(props))
  const hasInput = inputPosition == 'right'
  if (!hasInput && !utils.exists(icons) && !rightElement) return null

  return (
    <config.Layout className="form-field-content-right">
      {!hasInput && rightElement}
      {hasInput && <FieldInput {...props} />}
      {!hasInput && icons.map(i => <FormIcon {...i} />)}
    </config.Layout>
  )
}

const FormIcon = ({Wrapper = Fragment, wrapperProps, ...rest}) => {
  return (
    <Wrapper {...wrapperProps}>
      <Icon size={12} {...rest} />
    </Wrapper>
  )
}

const getIcon = ({readOnly, disabled, value, required, onChange, icon, defaultPickerValue, clearIcon = true}) => {
  if (disabled) return
  if (readOnly)
    return {
      name: 'locked',
      Wrapper: PopoutCard,
      wrapperProps: {title: t('form.general.tooltips.read_only')},
    }
  let buttons = []
  if (clearIcon && value && !required)
    buttons.push({
      name: 'cross',
      className: 'cross-icon',
      onClick: () => onChange(defaultPickerValue),
    })
  if (icon) buttons.push({name: 'caret-down'})
  return buttons
}

const getRightElement = ({rightElement, ...rest}) => {
  if (utils.exists(rest.maxLength) && !rightElement) rightElement = 'charCounter'

  if (!_.isString(rightElement)) {
    return rightElement
  }

  if (rightElement == 'charCounter') {
    return <CharCounter {...rest} />
  }
}

const CharCounter = ({maxLength, value, ...rest}) => {
  const charsLeft = maxLength - (value?.length || 0)
  return <Text>{charsLeft}</Text>
}
