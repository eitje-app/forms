import React, {Component, useState, Fragment, PropTypes, useRef, createRef} from 'react';

import Form from './form'
import {rules as _rules, messages as _messages} from './validation'

const FormCreator = ( {rules = {}, messages = {}, defaultProps={}} = {} ) => props => {

  const allRules = {..._rules, ...rules}
  const allMessages = {..._messages, ...messages}
  return <Form rules={allRules} messages={allMessages} test="baas" {...defaultProps} {...props} />
}


export default FormCreator




