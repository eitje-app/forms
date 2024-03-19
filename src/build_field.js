import React, {Fragment, useState, useRef} from 'react'
import useFormField from './use_form_field'
import {Button, Tooltip, t, tooltipElement, defaultIcon, clearIcon} from './base'
import utils from '@eitje/utils'
import {makeRegisteredField, makeNewRegisteredField} from './use_register_field'
import {findFns} from './field_click_helper'
import {LeftContent} from './left_content'
import {RightContent} from './right_content'

const decorateField =
  (Comp, compOpts = {}) =>
  (props) => {
    let {field, isTouched, value, readOnly, className, error, disabled, onChange, clearIcon, icon = defaultIcon} = props

    const [fieldOpen, setOpen] = useState(false)

    const onOpenChange = (open) => {
      // this is for date&timepicker, if you click outside antd's area, they trigger a 'clickOutside' event and hide the dropdown menu.
      // sadly, this event is fired BEFORE our click, and thus we never know if the dropdown ACTUALLY came from a closed state, or if it was just closed by the clickOutside event
      // the 200ms here is a proxy to differentiate between 'actually closed' & 'just closed by event trigger'
      setTimeout(() => {
        setOpen(open)
      }, 200)
    }

    const clickChild = (e) => {
      console.log(opts.className)
      findFns[opts.className]?.(element.current, {open: fieldOpen})
    }

    const opts = utils.funcOrVal(compOpts, props)
    const allProps = {...opts, ...props, Comp, onOpenChange, onVisibleChange: onOpenChange}

    const classNames = utils.makeCns(
      `eitje-form-3-field`,
      `eitje-form-3-field-${field}`,
      disabled && 'eitje-form-3-field-disabled',
      error && 'eitje-form-3-field-error',
      readOnly && 'eitje-form-3-read-only',
      icon && 'eitje-form-3-field-has-icon',
      clearIcon && 'eitje-form-3-field-has-clear-icon',
      className,
      opts.className,
    )

    const element = useRef(null)

    return (
      <div ref={element} onClick={clickChild} className={classNames}>
        <TooltipWrapper {...allProps}>
          <div className="form-field-content">
            <LeftContent {...allProps} />
            <RightContent {...allProps} />
          </div>
        </TooltipWrapper>
      </div>
    )
  }

const TooltipWrapper = ({tooltip, children}) => {
  if (!tooltip) return children
  return <Tooltip> {children} </Tooltip>
}

export const makeNewField = (Comp, compOpts = {}) => {
  const Formified = decorateField(Comp, compOpts)
  return makeNewRegisteredField(Formified, compOpts)
}
