import React from 'react'
import _ from 'lodash'
import {t} from './base'

export const simpleMap = (item) => {
  return {label: t(item), key: item, value: item }
}

const usePicker = ({items, noSort, value, multiple, defaultTitle = '-', formData, modifyItems = items => items, labelField="name", valueField="id", sortField=labelField}) => {
  let pickerItems = items;
  if(!noSort && sortField) pickerItems = _.sortBy(pickerItems, i => i[sortField]);

  pickerItems = pickerItems.map(t => !t[labelField] && !_.isObject(t) ? simpleMap(t) : 
                                      ({label: t[labelField] || "", key: String(t[valueField]), value: t[valueField], ...t }) ) 

  pickerItems = modifyItems(pickerItems, formData) || []

  const selectedItem = pickerItems.find(i => i.value === value) || {}
  const title = selectedItem.label || defaultTitle
  const selectedBaseItem = items.find(i => i[valueField] === value)
  
  const selectedItems = _.isArray(value) ? pickerItems.filter(i => value.includes(i.value)) : [selectedItem].filter(i => !_.isEmpty(i))

  return {pickerItems, selectedItems, title, selectedBaseItem, selectedItem, title}
}

export default usePicker


