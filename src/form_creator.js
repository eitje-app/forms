import React, {Component, useState, Fragment, PropTypes, useRef, createRef} from 'react';

import Form from './form'
import {rules as _rules, messages as _messages} from './validation'

// const FormCreator = ( {rules = {}, messages = {}, defaultProps = {} } = {} ) => React.forwardRef((props, ref) => {
//   const allRules = {field: {..._rules.field, ...rules.field}, name: {..._rules.name, ...rules.name} }

//   const allMessages = {field: {..._messages.field, ...messages.field}, name: {..._messages.name, ...messages.name} }

//   return <Form rules={allRules} ref={ref} messages={allMessages} {...defaultProps} {...props} />
// }




function makeForm( {rules = {}, messages = {}, defaultProps = {} } = {} ) {
   const allRules = {field: {..._rules.field, ...rules.field}, name: {..._rules.name, ...rules.name} }
   const allMessages = {field: {..._messages.field, ...messages.field}, name: {..._messages.name, ...messages.name} }

   class MyForm extends Component {

    render() {
      const {forwardRef, ...rest} = this.props
      return <Form ref={forwardRef} {...rest}/>
    }
   }

   return React.forwardRef((props, ref) => {
    return <MyForm forwardRef={ref} rules={allRules} messages={allMessages} {...props} />
  })

}

export default makeForm