import _ from 'lodash';
import React, {Component, useState, Fragment, PropTypes, useRef, createRef} from 'react';
import utils from '@eitje/utils'
import {t} from './base'

class Form extends Component {
  
  constructor(props) {
    const fields = props.initialValues && _.isObject(props.initialValues) ? _.cloneDeep(props.initialValues) : {}
    super(props)
    this.createRefs()
    this.state = {

      loading: false,

      blocked: {},
      touchedFields: [],
      errors: {},

      fields
    }
  }


  submitAllowed = () => {
     return this.empty() || (this.validate() && !this.blocked())
  }

  createRefs = () => {
    this.myChildren().forEach((c, idx) => {
      this[`child-${idx}`] = createRef()
    })
  }

  myChildren = () => {
    const {children = []} = this.props
    return _.isArray(children) ? children : [children]
  }

  convertFields = () => {
    const {nestedField} = this.props
    const {fields} = this.state
    return Object.keys(fields).map(id => ( {[nestedField]: id, ...fields[id] } ) )

  }

  submitted = () => {
    return this.state.submitted
  }

  empty() {
    const filled = Object.values(this.state.fields).some(val => utils.exists(val))
    return !filled
  }

  async submit({extraData = {}} = {} ) {
    const {nestedField, onSubmit, afterSubmMessage, afterSubmit = () => {}} = this.props
    const {fields} = this.state
    if(this.blocked()) return;
    const params = nestedField ? this.convertFields() : {...fields, ...extraData}
    if(this.validate()) {
      const res = await onSubmit(params)
      await this.setState({submitted: true})
      if(!res) return;
      if(res.ok) {
        afterSubmMessage && utils.toast(afterSubmMessage)
        afterSubmit(res, params)
        
      } 
    }
  }


  blocked() {
    const {alert} = this.props
    const {blocked = {}} = this.state
    if (Object.values(blocked).some(s => s)){
      alert(t("oneSec"), t("stillUploading"))
      return true;
    }
  }

  setNestedField = async (field, val, itemId) => {
    const {fields} = this.state
    const newFields =  
    {...fields, 
      [itemId]: {
          ...fields[itemId],
          [field]: val
        } 
      }
    this.setState({fields: newFields})
  }

  componentDidUpdate(prevProps, prevState) {
    const {afterTouch = () => {}} = this.props
    if(!prevState.touched && this.state.touched) {
      afterTouch()
    }

    if( !_.isEqual(prevProps.initialValues, this.props.initialValues) ) {
      this.updateUnTouchedFields(this.props.initialValues)
    }
  }

  updateUnTouchedFields = newVals => {
    const {touchedFields} = this.state
    const toBeUpdated = _.pickBy(newVals, (val, key) => !touchedFields.includes(key))
    const newFields = {...this.state.fields, ...toBeUpdated}
    this.setState({fields: newFields})
  }

  updateField = async (field, val, itemId, fieldProps) => {
    const {fields, errors, touched, touchedFields} = this.state
    const {namespace} = fieldProps
    const {afterChange} = this.props
    if(_.isArray(val) && val.length === 0) val = undefined;
    let newFields = {...this.state.fields}
    let currentHolder = newFields


    if(namespace) {
      if(!newFields[namespace]) newFields[namespace] = {};
      currentHolder = newFields[namespace]
    }

    if(currentHolder[field] === val) return;

    if(itemId) {
      this.setNestedField(field, val, itemId)
    }  

    else {
      currentHolder[field] = val
      await this.setState({fields: newFields})
      this.validateField(field, true, fieldProps)
    }
      
      afterChange && afterChange(field, val)
      
      if(!touchedFields.includes(field)) {
        this.setState({touchedFields: [...touchedFields, field] })
      }
      
      if(!touched) {
        this.setState({touched: true})
      }
  }

  handleRequired(required, val) {
   const {validationStarted} = this.state
   return validationStarted && (_.isFunction(required) ? required(this.state.fields) : required)
   // required fields not being filled is only an issue when a user really submits a form, not when they're typing
  }

  validateField(field, direct = false, fieldProps) {
    const {rules, messages} = this.props
    const {fields, errors} = this.state
    const {validate, required, validateMessage, name} = fieldProps
    const value = this.getValue(field, fieldProps)
    let error = null
    let valid;
    const isReq = this.handleRequired(required)

    if(isReq) error = !utils.exists(value) && t("form.required");

    if(validate && !error) {
      error = !validate(value, fields) && (validateMessage || t("form.invalid")) 
    }

    if(!error && rules.field[field]) {
      valid = rules.field[field](value, fields)
      error = !valid && messages.field[field]
    }

    if(!error && name && rules.name[name]) {
      valid = rules.name[name](value, fields)
      error = !valid && messages.name[name]
    }

    const newErrors = {...errors, [field]: error }
    direct && this.setState({errors: newErrors})
    return error // also possible to return errs instead of writing to state
  }

  async validate() {
    const {errors} = this.state
    let errs = {}
    let invalid;
    await this.setState({validationStarted: true})
    this.allFormChildren().forEach(c => {
      const {field} = c.props
      const error = this.validateField(field, false, c.props);
      errs[field] = error
      if(!invalid && error) invalid = true;
    })
    this.setState({errors: errs})
    return !invalid; 
  }

  allFormChildren = () => this.getFormChildren()

  getFormChildren = (el = this) => {
    if(!el.props) return []
    let {children} = el.props
    children = utils.alwaysArray(children)
    let els = children.filter(c => c && c.props && c.props.field)
    let stringEls = children.filter(c => _.isString(c))
    const wrappers = children.filter(c => c && c.props && c.props.fieldWrapper)
    wrappers.forEach(wrapper => {
      els = els.concat(this.getFormChildren(wrapper))
    })
    return els;
  }


  blockSubmit = (field, blocked) => {
    this.setState({blocked: {
      ...this.state.blocked,
      [field]: blocked
    } 
  })
    const that = this;
    if(blocked) {
      setTimeout(() => that.blockSubmit(field, false), 15000)
    }
  }

  resetValues = (empty) => {
    const newState = empty ? {} : this.props.initialValues
    this.setState({fields: newState})
  }

  setValues = obj => {
    const {fields} = this.state
    this.setState({fields: {...fields, ...obj}  })
  }

  renderLoading() {
    const {LoadingEl} = this.props
    if (this.state.loading && LoadingEl) {
      return (
        <LoadingEl/>       
      )
    } else {
      return null
    }
  }

  getNext = idx => {
    const ch =  this[`child-${idx + 1}`]
    if(ch && !ch.current) {
      return {current: ch}
    } else {
      return ch;
    }
  }

  getValue = (field, props) => {
    const {namespace, itemId} = props
    const {fields} = this.state
    if(namespace) {
      const namespaceFields = fields[namespace]
      return namespaceFields ? namespaceFields[field] : null
    }
    return itemId ? fields[itemId][field] : fields[field]   
  }

   enhanceChild = (c, {idx, extraProps} = {} ) => {
    const {updatedFields = [], disabled, onSubmit} = this.props
    const {field, itemId, namespace} = c.props
    const {errors, fields} = this.state

    const allProps = {...c.props, ...extraProps}

    const newEl = React.cloneElement(c, {key: itemId ? `${itemId}-${field}` : field,  formDisabled: disabled, innerRef: c.props.innerRef || this[`child-${idx}`], 
                                        updated: updatedFields.includes(field), formData: fields, value: this.getValue(field, allProps), 
                                        blockSubmit: (block = true) => this.blockSubmit(field, block), submitForm: () => this.submit(), 
                                        onChange: val => this.updateField(field, val, itemId, allProps), error: errors[field], getNext: () => this.getNext(idx),
                                        ...extraProps })
    return newEl;
  }



  renderChild = (c, idx) => {
    if(!c) return null;
    const {DefaultInput} = this.props

    if(_.isString(c) && DefaultInput) {
      return this.enhanceChild(<DefaultInput field={c}/>, {idx})
    }
    if(!c.props) return;

    const {errors, fields} = this.state
    const {field, fieldWrapper, namespace, submitButton} = c.props

    if(submitButton) {
      return React.cloneElement(c, {onClick: () => this.submit(), onPress: () => this.submit() })
    }

    if (fieldWrapper && c.props.children) {
      const defProps = {}
      if(namespace) defProps['namespace'] = namespace;
      const children = this.mapChildren(c.props.children, {namespace})
      return React.cloneElement(c, {children})
    }
    if(field) {
      return this.enhanceChild(c, {idx})
    } 
    else {
      return React.cloneElement(c)
    }
  }
  

mapChildren = (children = [], extraProps = {}) => {
  const childs = utils.alwaysDefinedArray(children)
  return childs.map(c => {
    if(!c || !c.props) return c;
    if(c.props.field) return this.enhanceChild(c, {extraProps});
    if(!c.props.children) return c;
    return React.cloneElement(c, {children: this.mapChildren(c.props.children)})
  })
}

  render() {
    const {children, debug, onFocus = () => {}} = this.props
    const {errors, fields} = this.state
    return (
      
      <div tabIndex={-1} onFocus={onFocus} >
        {React.Children.map(children, (c, idx) => this.renderChild(c, idx))}

        {this.renderLoading()}

      </div>
      )
    }
  
}


export default Form



