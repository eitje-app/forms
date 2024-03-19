import utils from '@eitje/web_utils'
import {t, config} from './base'
import {Text} from '@eitje/web_components'
export const LeftContent = (props) => {
  const {Comp} = props
  return (
    <config.Layout direction="vertical" className="form-field-content-left">
      <Label {...props} />
      <Comp placeholder="..." {...props} />
      <ValidationError {...props} />
    </config.Layout>
  )
}

const Label = (props) => {
  const {required} = props
  const label = buildDecoration({...props, decorationType: 'label'})
  const popoutTitle = buildDecoration({...props, decorationType: 'tooltip'})
  return (
    <Text popoutTitle={popoutTitle} className="eitje-form-3-label">
      {label} {required && '*'}
    </Text>
  )
}

const ValidationError = ({error}) => {
  return <Text className="eitje-form-3-error">{error}</Text>
}

const decorationDefaults = {
  label: true,
  placeholder: true,
}

const buildDecoration = (props) => {
  const {decorationType} = props
  let val = props.hasOwnProperty(decorationType) ? props[decorationType] : decorationDefaults[decorationType]
  if (_.isFunction(val)) val = val(props)
  if (_.isBoolean(val)) return makeTranslation(props)
  return val
}

const numAtEndRegex = /-\d+\b/g // this is done for compositeField, because it suffixes fields with -number, like user_id-1

const makeTranslation = (props) => {
  let {label, decorationType, field, name} = props
  if (!field) return

  field = field.replace(numAtEndRegex, '')

  const namespaces = utils.alwaysDefinedArray(name)
  const decorationName = utils.camelToSnake(decorationType)
  const opts = props.i18nOpts || {}

  let allKeys = namespaces.map((n) => {
    return `form.${n}.fields.${field}.${decorationName}`
  })

  const lastOption = decorationType == 'placeholder' && '...'

  allKeys = [...allKeys, `form.defaults.fields.${field}.${decorationType}`, `records.default.fields.${field}`, lastOption].filter(Boolean)

  return t(allKeys, opts) // form.exportLayouts.fields.name.label|placeholder|extraLabel|tooltip
}
