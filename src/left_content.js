import React from 'react'
import {config} from './base'
import {FieldInput} from './field_input'
import {buildDecoration} from './build_decoration'

export const LeftContent = props => {
  const {inputPosition = 'left'} = props

  return (
    <config.Layout direction="vertical" className="form-field-content-left">
      <Label {...props} />
      {inputPosition == 'left' && <FieldInput {...props} />}
      <ValidationError {...props} />
    </config.Layout>
  )
}

const Label = props => {
  const {required, readOnly, disabled, infoIconMessage} = props
  const label = buildDecoration({...props, decorationType: 'label'})
  const extraLabel = buildDecoration({
    ...props,
    decorationType: 'extraLabel',
  })

  // use title and body directly from infoIconMessage prop, or use decorationTypes
  const _infoIconMessage = infoIconMessage && {
    title: buildDecoration({['popout.title']: true, ...props, decorationType: 'popout.title'}),
    body: buildDecoration({['popout.body']: true, ...props, decorationType: 'popout.body'}),
    ...infoIconMessage,
  }

  const showRequired = !readOnly && !disabled
  return (
    <>
      <config.Text truncate infoIconMessage={_infoIconMessage} color="dark-grey" fontSize={12}>
        {label} {showRequired && required && '*'}
      </config.Text>
      {extraLabel && (
        <config.Text truncate color="dark-grey" fontSize={12}>
          {extraLabel}
        </config.Text>
      )}
    </>
  )
}

const ValidationError = ({error}) => {
  return (
    <config.Text fontSize={12} color="medium-red">
      {error}
    </config.Text>
  )
}
