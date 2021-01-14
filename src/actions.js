import React, {Fragment} from 'react'
import useFormField from './use_form_field'
import {Button, t} from './base'
import utils from '@eitje/utils'

export const makeField = (Comp, {withLabel = true, withError = true} = {}) => props => {
  let {containerStyle = {}, field, Container = 'div', isTouched, disabledStyle = {opacity: 0.2}, 
        containerProps = {}, submitStrategy, submitForm, value, isLayered = submitStrategy === 'inlineButton',
        LeftContainer = Fragment, RightContainer = Fragment, rightChildren, leftChildren, 
        leftContainerProps = {}, rightContainerProps = {}, SubmitButton = Button, hidden } = props

 if(hidden) return null;
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
      <Container className="elementContainer" style={style} {...containerProps} >

        <LeftContainer {...leftContainerProps}>
          {leftChildren}
        {withLabel && label && label}
          <Comp innerClass={classNames} {...props} {...prupz}/>
        </LeftContainer>

        <RightContainer {...rightContainerProps}>
          {rightChildren}
          {isButtonSubmit && isTouched && utils.exists(value) &&
            <div onClick={() => submitForm({field})} >
              <SubmitButton> {t("submit")} </SubmitButton> 
            </div>
          }
          
          </RightContainer>
        {withError && error && error}
      </Container>



    )
}


