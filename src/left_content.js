import React from 'react'
import utils from '@eitje/web_utils'
import {t, config} from './base'
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
  const {required, readOnly, disabled, infoIconMessage} = props
  const label = buildDecoration({...props, decorationType: 'label'})
  const extraLabel = buildDecoration({
    ...props,
    decorationType: 'extraLabel',
  })

  // use title and body directly from infoIconMessage prop, or use decorationTypes
  const _infoIconMessage = infoIconMessage && {
    title: buildDecoration({['popout.title']: true, ...props, decorationType: 'popout.title'}),
    body: buildDecoration({['popout.body']: true, ...props, decorationType: 'popout.body'}),
    ...infoIconMessage,
  }

  const showRequired = !readOnly && !disabled
  return (
    <>
      <config.Text truncate infoIconMessage={_infoIconMessage} darkGrey fontSize={12}>
        {label} {showRequired && required && '*'}
      </config.Text>
      {extraLabel && (
        <config.Text truncate darkGrey fontSize={12}>
          {extraLabel}
        </config.Text>
      )}
    </>
  )
}

const ValidationError = ({error}) => {
  return (
    <config.Text fontSize={12} mediumRed>
      {error}
    </config.Text>
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

const makeNamespaceTranslation = ({field, decorationName, namespaces}) => {
  return namespaces.map(n => {
    return `form.${n}.fields.${field}.${decorationName}`
  })
}

const makeTranslation = props => {
  let {label, decorationType, tableName, field, formName: name} = props
  if (!field) return

  field = field.replace(numAtEndRegex, '')

  const namespaces = utils.alwaysDefinedArray(name)
  const decorationName = utils.camelToSnake(decorationType)
  const opts = props.i18nOpts || {}

  let allKeys = makeNamespaceTranslation({field, decorationName, namespaces})

  const lastOption = decorationType == 'placeholder' && '...'

  if (tableName) allKeys = [...allKeys, `records.${tableName}.fields.${field}`]

  if (decorationType == 'popout.title') {
    // fallback to label title if tooltip isn't defined as it's often the same
    allKeys = [...allKeys, ...makeNamespaceTranslation({field, decorationName: 'label', namespaces})]
  }

  allKeys = [...allKeys, `form.defaults.fields.${field}.${decorationType}`, `records.default.fields.${field}`, lastOption].filter(Boolean)

  return t(allKeys, opts) // form.exportLayouts.fields.name.label|placeholder|extraLabel|tooltip
}
