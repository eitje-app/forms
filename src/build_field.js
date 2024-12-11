import utils from '@eitje/utils'
import React, {useEffect, useRef, useState} from 'react'
import {Tooltip, config} from './base'
import {findFns} from './field_click_helper'
import {LeftContent} from './left_content'
import {RightContent} from './right_content'
import {makeNewRegisteredField} from './use_register_field'

const decorateField =
  (Comp, compOpts = {}) =>
  props => {
    let {readOnly, formData, isFirst, autoFocus = true, className, error, disabled} = props
    const element = useRef(null)
    const [fieldOpen, setOpen] = useState(false)

    const onOpenChange = open => {
      // this is for date&timepicker, if you click outside antd's area, they trigger a 'clickOutside' event and hide the dropdown menu.
      // sadly, this event is fired BEFORE our click, and thus we never know if the dropdown ACTUALLY came from a closed state, or if it was just closed by the clickOutside event
      // the 200ms here is a proxy to differentiate between 'actually closed' & 'just closed by event trigger'
      setTimeout(() => {
        setOpen(open)
      }, 200)
    }

    const clickChild = e => {
      const classNames = opts.className.split(' ')
      const fn = findFns[classNames.find(name => findFns[name])] || findFns['default']
      if (readOnly || disabled) return null
      fn(element.current, {open: fieldOpen})
    }

    const required = utils.funcOrVal(props.required, formData)

    const opts = utils.funcOrVal(compOpts, props)
    const allProps = {
      ...opts,
      ...props,
      required,
      Comp,
      element: element.current,
      onOpenChange,
      onVisibleChange: onOpenChange,
    }

    const classNames = utils.makeCns(
      `eitje-form-3-field`,
      disabled && 'disabled',
      error && 'error',
      readOnly && 'read-only',
      className,
      opts.className,
    )

    const {onChange, ...propsWithoutChange} = allProps
    useEffect(() => {
      if (isFirst && autoFocus) {
        element.current?.querySelector('input')?.focus?.()
      }
    }, [isFirst])

    return (
      <div
        {...propsWithoutChange}
        ref={element}
        onClick={clickChild}
        className={classNames}
        height="full"
        padding="16 24"
        horizontal="spaceBetween"
      >
        <TooltipWrapper {...allProps}>
          <config.Layout className="form-field-content" horizontal="spaceBetween" height="full" padding="16 24">
            <LeftContent {...allProps} />
            <RightContent {...allProps} />
          </config.Layout>
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
