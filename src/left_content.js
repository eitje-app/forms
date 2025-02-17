import React from 'react'
import utils from '@eitje/web_utils'
import {t, config} from './base'
import {Text} from './circular_dependency_fix'
import {FieldInput} from './field_input'

export const LeftContent = props => {
  const {Comp, inputPosition = 'left'} = props
  const label = buildDecoration({...props, decorationType: 'label'})

  return (
    <config.Layout direction="vertical" className="form-field-content-left">
      <Label {...props} />
      {inputPosition == 'left' && <FieldInput {...props} />}
      <ValidationError {...props} />
    </config.Layout>
  )
}

const Label = props => {
  const {required, readOnly, disabled} = props
  const label = buildDecoration({...props, decorationType: 'label'})
  const extraLabel = buildDecoration({
    ...props,
    decorationType: 'extraLabel',
  })
  const popoutTitle = buildDecoration({...props, decorationType: 'tooltip'})
  const popoutBody = buildDecoration({...props, decorationType: 'popoutBody'})

  const showRequired = !readOnly && !disabled
  return (
    <>
      <Text truncate popoutTitle={popoutTitle} popoutBody={popoutBody} PopoutComponent={props.PopoutComponent} darkGrey fontSize={12}>
        {label} {showRequired && required && '*'}
      </Text>
      {extraLabel && (
        <Text truncate darkGrey fontSize={12}>
          {extraLabel}
        </Text>
      )}
    </>
  )
}

const ValidationError = ({error}) => {
  return (
    <Text fontSize={12} mediumRed>
      {error}
    </Text>
  )
}

const decorationDefaults = {
  label: true,
  placeholder: true,
}

export const buildDecoration = props => {
  const {decorationType} = props
  let val = props.hasOwnProperty(decorationType) ? props[decorationType] : decorationDefaults[decorationType]
  if (_.isFunction(val)) val = val(props)
  if (_.isBoolean(val) && val) return makeTranslation(props)
  return val
}

const numAtEndRegex = /-\d+\b/g // this is done for compositeField, because it suffixes fields with -number, like user_id-1

const makeTranslation = props => {
  let {label, decorationType, field, name} = props
  if (!field) return

  field = field.replace(numAtEndRegex, '')

  const namespaces = utils.alwaysDefinedArray(name)
  const decorationName = utils.camelToSnake(decorationType)
  const opts = props.i18nOpts || {}

  let allKeys = namespaces.map(n => {
    return `form.${n}.fields.${field}.${decorationName}`
  })

  const lastOption = decorationType == 'placeholder' && '...'

  allKeys = [...allKeys, `form.defaults.fields.${field}.${decorationType}`, `records.default.fields.${field}`, lastOption].filter(Boolean)

  return t(allKeys, opts) // form.exportLayouts.fields.name.label|placeholder|extraLabel|tooltip
}
