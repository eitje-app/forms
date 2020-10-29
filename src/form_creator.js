import React, {Component, useState, Fragment, PropTypes, useRef, createRef} from 'react';

import Form from './form'
import {rules as _rules, messages as _messages} from './validation'

const FormCreator = ( {rules = {}, messages = {}, defaultProps = {} } = {} ) => props => {

  const allRules = {field: {..._rules.field, ...rules.field}, name: {..._rules.name, ...rules.name} }

  const allMessages = {field: {..._messages.field, ...messages.field}, name: {..._messages.name, ...messages.name} }

  return <Form rules={allRules} messages={allMessages} {...defaultProps} {...props} />
}

export default FormCreator




