import _ from 'lodash'
import {t, isScoped} from './base'
import utils from '@eitje/utils'
export const simpleMap = (item, buildLabel) => {
  const label = buildLabel ? buildLabel(item) : makeLabel(item)
  return {label, key: item, value: item}
}

const makeLabel = (label) => {
  if (!label) return
  if (isScoped) return t(`form.dropdown.${label}`, label)
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
}) => {
  if (!items) items = []
  items = utils.alwaysDefinedArray(items)
  let pickerItems = items
  if (!noSort && sortField) pickerItems = _.sortBy(pickerItems, (i) => i[sortField])
  pickerItems = pickerItems.map((t) =>
    !t[labelField] && !_.isObject(t)
      ? simpleMap(t, buildLabel)
      : {
          ...t,
          key: String(t[valueField]),
          value: t[valueField],
          label: (buildLabel ? buildLabel(t[labelField], t) : makeLabel(t[labelField])) || '',
        },
  )

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
