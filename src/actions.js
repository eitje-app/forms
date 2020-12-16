import React from 'react'
import useFormField from './use_form_field'

export const makeField = (Comp, {withLabel = true, withError = true} = {}) => props => {
  const {containerStyle = {}, Container = 'div', disabledStyle = {opacity: 0.2}, containerProps = {} } = props
  const prupz = useFormField(props)
  const {label, error, disabled} = prupz

  const classNames = [error && 'has-error'].filter(
      Boolean,
  ).join(" ")

  let style = containerStyle
  if(disabled) style = {...disabledStyle, ...style}


  return (
      <Container style={style} {...containerProps} >
        {withLabel && label && label}
          <Comp innerClass={classNames} {...props} {...prupz}/>
        {withError && error && error}
      </Container>

    )
}


