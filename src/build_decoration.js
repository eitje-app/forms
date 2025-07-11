import utils from '@eitje/web_utils'
import {t} from './base'

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
