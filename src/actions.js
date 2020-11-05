import React from 'react'
import useFormField from './use_form_field'

export const makeField = Comp => props => {
  const {containerStyle = {}, Container = 'div', containerProps = {} } = props
  const prupz = useFormField(props)
  const {label, error, disabled} = prupz

  const classNames = [error && 'has-error'].filter(
      Boolean,
  ).join(" ")


  return (
      <Container style={{opacity: disabled ? 0.2 : 1, ...containerStyle}} {...containerProps} >
        {label && label}
          <Comp innerClass={classNames} {...props} {...prupz}/>
        {error && error}
      </Container>

    )
}