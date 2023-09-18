import _ from 'lodash'
import {t, isScoped} from './base'
import utils from '@eitje/utils'

export const simpleMap = (item, buildLabel, props) => {
  const label = buildLabel ? buildLabel(item) : makeLabel(item, props)
  return {label, key: item, value: item}
}

const numAtEndRegex = /-\d+\b/g // this is done for compositeField, because it suffixes fields with -number, like user_id-1

const makeLabel = (label, {field, transNamespace} = {}) => {
  if (!label) return
  if (field) field = field.replace(numAtEndRegex, '')
  if (isScoped) {
    if (transNamespace) return t(`form.${transNamespace}.fields.${field}.options.${label}`, t(`form.dropdown.${label}`), label)
    return t(`form.dropdown.${label}`, label)
  }
  return t(label, label)
}

const usePicker = ({
  items = [],
  noSort,
  value,
  defaultTitle = '-',
  formData,
  buildLabel,
  modifyItems = (items) => items,
  labelField = 'name',
  valueField = 'id',
  sortField = labelField,
  ...rest
}) => {
  if (!items) items = []
  items = utils.alwaysDefinedArray(items)
  let pickerItems = items
  if (!noSort && sortField) pickerItems = _.sortBy(pickerItems, (i) => i[sortField])

  pickerItems = pickerItems.map((t) => {
    if (!_.isObject(t)) return simpleMap(t, buildLabel, rest)
    return {
      ...t,
      key: String(t[valueField]),
      value: t[valueField],
      label: (buildLabel ? buildLabel(t[labelField], t) : makeLabel(t[labelField])) || '',
    }
  })

  pickerItems = modifyItems(pickerItems, formData) || []

  const selectedItem = pickerItems.find((i) => i.value === value) || {}
  const title = selectedItem.label || defaultTitle
  const selectedBaseItem = items.find((i) => i[valueField] === value)

  const selectedItems = _.isArray(value) ? pickerItems.filter((i) => value.includes(i.value)) : [selectedItem].filter((i) => !_.isEmpty(i))

  const unsortedSelectedItems = _.isArray(value)
    ? _.sortBy(pickerItems, (v) => _.indexOf(value, v[valueField])).filter((i) => value.includes(i.value))
    : [selectedItem].filter((i) => !_.isEmpty(i))

  return {
    pickerItems,
    selectedItems,
    unsortedSelectedItems,
    title,
    selectedBaseItem,
    selectedItem,
  }
}

export default usePicker
