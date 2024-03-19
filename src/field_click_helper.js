import React, {Fragment, useState} from 'react'
import useFormField from './use_form_field'
import {Button, Tooltip, t, tooltipElement, defaultIcon, clearIcon} from './base'
import utils from '@eitje/utils'
import {makeRegisteredField} from './use_register_field'

function fireMouseEvents(element, eventNames = ['mousedown']) {
  // we stole this from SO to emulate mousedown/other non-click mouse events
  if (element && eventNames && eventNames.length) {
    for (var index in eventNames) {
      var eventName = eventNames[index]
      if (element.fireEvent) {
        element.fireEvent('on' + eventName)
      } else {
        var eventObject = document.createEvent('MouseEvents')
        eventObject.initEvent(eventName, true, false)
        element.dispatchEvent(eventObject)
      }
    }
  }
}

const findInput = (field) => {
  let child = field.querySelector('input') || field.querySelector('textarea') // for now, we assume the 'actual' input is always an input AND there is always only one

  child?.focus()
}

const findTimeInput = (field, {open}) => {
  let child = field.querySelector('input')

  !open && fireMouseEvents(child)
}

const clickListPickerTrigger = (field, {open}) => {
  const child = document.querySelector('.form-trigger-container')
  if (!open) child.click()
}

export const findFns = {
  'eitje-input-container': findInput,
  'eitje-time-picker-container': findTimeInput,
  'eitje-date-picker-container': findTimeInput,
  'eitje-list-picker': clickListPickerTrigger,
}
