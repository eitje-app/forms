import utils from '@eitje/utils'
import _ from 'lodash'
import {isScoped, t} from './base'

export const simpleMap = (item, buildLabel, props) => {
  const label = buildLabel ? buildLabel(item) : makeLabel(item, props)
  return {label, key: item, value: item}
}

const numAtEndRegex = /-\d+\b/g // this is done for compositeField, because it suffixes fields with -number, like user_id-1

const makeLabel = (label, {field, transNamespace, name} = {}) => {
  if (!label) return
  if (field) field = field.replace(numAtEndRegex, '')

  const _name = utils.alwaysDefinedArray(transNamespace || name)

  if (isScoped) {
    if (_name.length > 0) {
      const nameKeys = _name.map(n => `form.${n}.fields.${field}.options.${label}`)
      const allKeys = [...nameKeys, `form.dropdown.${label}`, label]
      return t(allKeys)
    }
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
  modifyItems = items => items,
  labelField = 'name',
  valueField = 'id',
  sortField = labelField,
  ...rest
}) => {
  if (!items) items = []
  items = utils.alwaysDefinedArray(items)
  let pickerItems = items
  if (!noSort && sortField) pickerItems = _.sortBy(pickerItems, i => i[sortField])

  pickerItems = pickerItems.map(t => {
    if (!_.isObject(t)) return simpleMap(t, buildLabel, rest)
    return {
      ...t,
      key: String(t[valueField]),
      value: t[valueField],
      label: (buildLabel ? buildLabel(t[labelField], t) : makeLabel(t[labelField])) || '',
    }
  })

  pickerItems = modifyItems(pickerItems, formData) || []

  const selectedItem = pickerItems.find(i => i.value === value) || {}
  const title = selectedItem.label || defaultTitle
  const selectedBaseItem = items.find(i => i[valueField] === value)

  const selectedItems = _.isArray(value) ? pickerItems.filter(i => value.includes(i.value)) : [selectedItem].filter(i => !_.isEmpty(i))

  const unsortedSelectedItems = _.isArray(value)
    ? _.sortBy(pickerItems, v => _.indexOf(value, v[valueField])).filter(i => value.includes(i.value))
    : [selectedItem].filter(i => !_.isEmpty(i))

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
