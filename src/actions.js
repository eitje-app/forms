import React from 'react'
import useFormField from './use_form_field'
import {Button} from './base'


export const makeField = (Comp, {withLabel = true, withError = true} = {}) => props => {
  const {containerStyle = {}, field, Container = 'div', isTouched, disabledStyle = {opacity: 0.2}, 
        containerProps = {}, submitStrategy, submitForm } = props
  
  const isButtonSubmit = submitStrategy === 'inlineButton'
  
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
          {isButtonSubmit && isTouched && <Button onClick={() => submitForm({field})}> submit gap </Button> }
        {withError && error && error}
      </Container>

    )
}


