import React from 'react'
import _ from 'lodash'

export const simpleMap = (item) => {
  return {label: item, key: item, value: item }
}

const usePicker = ({items, noSort, value, defaultTitle = '-', formData, modifyItems = items => items, labelField="name", valueField="id"}) => {
  let pickerItems = items;
  if(!noSort) pickerItems = _.sortBy(pickerItems, i => i[labelField]);

  pickerItems = pickerItems.map(t => !t[labelField] && !_.isObject(t) ? simpleMap(t) : 
                                      ({label: t[labelField] || "", key: String(t[valueField]), value: t[valueField], ...t }) ) 

  pickerItems = modifyItems(pickerItems, formData) || []

  const selectedItem = pickerItems.find(i => i.value === value) || {}
  const title = selectedItem.label || defaultTitle
  const selectedBaseItem = items.find(i => i[valueField] === value)
  return {pickerItems, title, selectedBaseItem, selectedItem, title}
}

export default usePicker


