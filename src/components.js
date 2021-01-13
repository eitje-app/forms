import _ from 'lodash';
import React, {Component, useState, Fragment, PropTypes, useRef, createRef} from 'react';
import utils from '@eitje/utils'
import {t} from './base'

export const FieldGroup = ({children, namespace}) => 
  <div fieldWrapper>
    { React.Children.map(children, (c, idx) => React.cloneElement(c, {namespace, boon: true} )) }
</div>