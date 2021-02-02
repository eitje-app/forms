import _ from 'lodash';
import React, {Component, useState, Fragment, PropTypes, useRef, createRef} from 'react';
import utils from '@eitje/utils'
import {t, Button, Prompt} from './base'

const missingOrTrue = (obj, field) => {
  const hasField =  Object.keys(obj).includes(field)
  return !hasField || obj[field]
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};



class Form extends Component {

  constructor(props) {
    const {debounceTime = 1000} = props
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
    this.resetValues = this.resetValues.bind(this)
    this.submit = this.submit.bind(this)
    this.submit = debounce(this.submit, debounceTime, true)
  }

  isForm = true

  submitAllowed = () => {
     const {allowEmpty} = this.props
     return (allowEmpty && this.empty()) || (this.validate() && !this.blocked())
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

  getParams = () => this.state.fields

  fieldNames = () => utils.alwaysDefinedArray( this.allFormChildren().map(c => c?.props?.field) )

  async submit({extraData = {}, field, callback = () => {} } = {} ) {
    const {nestedField, onSubmit, 
          identityField="id"} = this.props         
    const {fields} = this.state
    if(this.blocked()) return;
    
    let params = field ? _.pick(fields, [field, identityField]) : _.pick(fields, [...this.fieldNames(), identityField])

    params = {...params, ...extraData}
    if(nestedField) params = this.convertFields();
    console.group("FORM")
    console.log("Start validation")
    if(this.validate({fields: [field].filter(Boolean) })) {
      console.log("Params to be submitted", params)
      const res = await onSubmit(params)
      await this.setState({submitted: true})
      if(!res) return;
      if(res.ok) this.afterSubmit(params, res, callback);
      if(res.status == 422) this.handleErrors(res)
    }
    
    console.groupEnd()
  }

  handleErrors(res) {
    const errors = res.data?.errors
    if(!_.isObject(errors)) return;
    const newErrors = _.mapValues(errors, err => err[0] ) 
    console.log(newErrors)
    this.setState({errors: {...this.state.errors, ...newErrors} })
  }


  afterSubmit(params, res, callback = () => {}) {
    const {afterSubmMessage, afterSubmit = () => {}, resetAfterSubmit} = this.props
    afterSubmMessage && utils.toast(afterSubmMessage)
    afterSubmit(res, params)
    callback(res, params)
    if(resetAfterSubmit) this.resetValues();
    this.setState({touchedFields: [], touched: false})

  }


  blocked() {
    const {blocked = {}} = this.state
    if (Object.values(blocked).some(s => s)){
      config.alert(t("oneSec"), t("stillUploading"))
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

  if(!_.isEqual(prevProps.initialValues, this.props.initialValues) ) {
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
      
    afterChange && afterChange(field, val, newFields)
      
    if(!touchedFields.includes(field)) {
      this.setState({touchedFields: [...touchedFields, field] })
    }
      
    if(!touched) {
      this.setState({touched: true})
    }

    if(fieldProps.submitStrategy === 'change') {
      this.submit({field})
    }
  }

  handleRequired(required, val) {
   return _.isFunction(required) ? required(this.state.fields) : required
  
   // required fields not being filled is only an issue when a user really submits a form, not when they're typing
  }

  validateField(field, direct = false, fieldProps, {checkRequired} = {} ) {
    const {rules, messages} = this.props
    const {fields, errors} = this.state
    const {validate, required, validateMessage, name} = fieldProps
    const value = this.getValue(field, fieldProps)
    let error = null
    let valid;
    const isReq = checkRequired && this.handleRequired(required)
    
    if(isReq) error = !utils.exists(value) && t("form.required");

    if(validate && !error) {
      error = !validate(value, fields) && (validateMessage || t("form.invalid")) 
    }

    if(!error && rules.field[field]) {
      valid = rules.field[field](value, fields)
      error = !valid && (messages.field[field] || t("form.invalid"))
    }

    if(!error && name && rules.name[name]) {
      valid = rules.name[name](value, fields)
      error = !valid && (messages.name[name] || t("form.invalid"))
    }

    const newErrors = {...errors, [field]: error }
    direct && this.setState({errors: newErrors})
    return error // also possible to return errs instead of writing to state
  }

  validate({fields = []} = {}) {
    const {errors} = this.state
    let errs = {}
    let invalid;
    const hasSpecificFields = fields.length > 0
    this.allFormChildren().forEach(c => {
      const {field} = c.props
      if(hasSpecificFields && !fields.includes(field)) return;
      const error = this.validateField(field, false, c.props, {checkRequired: true});
      errs[field] = error
      
      if(!invalid && error) {
        invalid = true;
        console.log("Failed validation", error)
      }

    })
    this.setState({errors: errs})
    return !invalid; 
  }

  allFormChildren = () => this.getFormChildren()

  getFormChildren = (el = this) => {
    if(!el.props) return []
    if(this.isHidden(el)) return []
    let {children} = el.props
    children = utils.alwaysArray(children)
    let els = children.filter(c => c && c.props && c.props.field && !this.isHidden(c))
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

  getValues = (...fields) => {
    return _.pick(this.state.fields, fields)
  }

  getValue = (field, props = {}) => {
    const {namespace, itemId} = props
    const {fields} = this.state
    if(namespace) {
      const namespaceFields = fields[namespace]
      return namespaceFields ? namespaceFields[field] : null
    }
    if(!fields) {
      return null;
    }
    return itemId ? fields[itemId][field] : fields[field]   
  }

   enhanceChild = (c, {idx, extraProps} = {} ) => {
    const {updatedFields = [], disabled, onSubmit, fieldProps} = this.props
    const {errors, fields, touchedFields} = this.state
    const condOpts = {}
    const _fieldProps = Object.assign({}, extraProps, fieldProps, c.props)
    const {field, itemId, namespace, submitStrategy} = _fieldProps
    const act = () => touchedFields.includes(field) && this.submit({field})
    
    if(submitStrategy === 'blur') condOpts['onBlur'] = act; 

    if(submitStrategy === 'blur' || submitStrategy === 'inlineButton') {
      condOpts['onKeyUp'] = e => {
        e.keyCode === 13 && act()
      }
    }

    const newEl = React.cloneElement(c, {key: itemId ? `${itemId}-${field}` : field,  formDisabled: disabled, innerRef: c.props.innerRef || this[`child-${idx}`], 
                                        updated: updatedFields.includes(field), formData: fields, value: this.getValue(field, _fieldProps), isTouched: touchedFields.includes(field), 
                                        blockSubmit: (block = true) => this.blockSubmit(field, block), submitForm: this.submit, resetForm: this.resetValues,
                                        onChange: val => this.updateField(field, val, itemId, _fieldProps), error: errors[field], getNext: () => this.getNext(idx),
                                        ...condOpts, ...extraProps, ..._fieldProps })
    return newEl;
  }


  isHidden = c => {
    const {hiddenFields = []} = this.props
    const {fields} = this.state
    const hidden = c?.props?.hidden
    return (hiddenFields.includes(c.props.field) || utils.funcOrBool(hidden, fields) )
  }

  renderChild = (c, idx) => {
    if(!c) return null;
    const {DefaultInput} = this.props

    if(_.isString(c) && DefaultInput) {
      return this.enhanceChild(<DefaultInput field={c}/>, {idx})
    }

    if(!c.props) return;
    if(this.isHidden(c)) return null;
    const {errors, fields} = this.state
    const {field, fieldWrapper, namespace, submitButton} = c.props

    if(submitButton) {
      return this.makeSubmitButton(c)
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
  const childs = utils.alwaysDefinedArray(children).flat()
  return childs.map(c => {
    if(!c || !c.props) return c;
    if(this.isHidden(c)) return null;
    if(c.props.field) return this.enhanceChild(c, {extraProps});
    if(c.props.submitButton) return this.makeSubmitButton(c)
    if(!c.props.children) return c;
    return React.cloneElement(c, {children: this.mapChildren(c.props.children)})
  })
}

  makeSubmitButton(c) {
    if(c.props.showAfterTouch && !this.state.touched) return null;
    return React.cloneElement(c, {onClick: () => this.submit(), onPress: () => this.submit() })
  }

  render() {
    const {children, showPrompt, submitButton, promptMsg="are you sure", debug, onFocus = () => {}} = this.props
    const {errors, fields, touchedFields} = this.state
    return (
      
      <div tabIndex={-1} onFocus={onFocus} >
        {React.Children.map(children, (c, idx) => this.renderChild(c, idx))}

        {this.renderLoading()}
        {submitButton && <Button onClick={this.submit}> {t("submit")} </Button> }
      </div>
      )
    }
  
}


export default Form



