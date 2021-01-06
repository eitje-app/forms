import React, {Fragment} from 'react'
import useFormField from './use_form_field'
import {Button, t} from './base'


export const makeField = (Comp, {withLabel = true, withError = true} = {}) => props => {
  let {containerStyle = {}, field, Container = 'div', isTouched, disabledStyle = {opacity: 0.2}, 
        containerProps = {}, submitStrategy, submitForm, isLayered = submitStrategy === 'inlineButton',
        LeftContainer = Fragment, RightContainer = Fragment, leftContainerProps = {}, rightContainerProps = {} } = props


 if(isLayered) {
    LeftContainer = RightContainer = "div"
    leftContainerProps = {className: 'form-container-left'}
    rightContainerProps = {className: 'form-container-right'}
 }

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

        <LeftContainer {...leftContainerProps}>
        {withLabel && label && label}
          <Comp innerClass={classNames} {...props} {...prupz}/>
        </LeftContainer>

        <RightContainer {...rightContainerProps}>
          {isButtonSubmit && isTouched && 
            <Button onClick={() => submitForm({field})}> {t("submit")} </Button> 
          }
          
          </RightContainer>
        {withError && error && error}
      </Container>

    )
}


