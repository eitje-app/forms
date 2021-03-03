import React, {Component, Fragment} from 'react'
import utils from '@eitje/utils'

const isForm = child => child?.ref?.current && ( child?.props?.formKey )

const isWrapper = child => child?.props?.formWrapper


class FormWrapper extends Component {

  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  formChilds(children = this.props.children) {
    children = utils.alwaysDefinedArray(children) || []
    return children.map(c => {
      let arr = []
      if(isForm(c)) arr.push(c.ref.current)
      if(isWrapper(c)) arr.push(...this.formChilds(c.props.children))
      return arr;
    }).flat()
  }

  submitAllowed() {
    return this.formChilds().every(c => c && c.submitAllowed())
  }

  getParams() {
    return Object.assign(...this.formChilds().map(c => c.getParams()))
  }

  afterSubmit(data, res) {
    this.formChilds().filter(c => _.isFunction(c.afterSubmit) ).forEach(c => c.afterSubmit(data, res))
  }

  async submit() {
    const childs = this.formChilds() 
    if(!this.submitAllowed() ) return;

    const allHaveKey = childs.every(c => c.props.formKey)
    let data = {} //allHaveKey ? {} : []
    childs.forEach(c => {
      let val = c.getParams()
      data[c.props.formKey] = c.getParams()
    })
    const res = await this.doSubmit(data)
    if(_.isObject(res) && !res.ok || !res) return
    this.afterSubmit()
  }

  async doSubmit(data) {
    const {onSubmit, afterSubmit = () => {}} = this.props
    const res = await onSubmit(data)
    if(res === true || res?.ok) {
      afterSubmit(res, data)
      return res
    }
  }

  render() {
    const {children} = this.props
    const childs = utils.alwaysDefinedArray(children)
    const submitButton = childs.find(c => c?.props?.submitButton)
    const otherChilds = childs.filter(c => !c?.props?.submitButton)
    return (
      <Fragment>
        {otherChilds}
        {submitButton && React.cloneElement(submitButton, {onClick: this.submit} )}
      </Fragment>
    )
  }
}

export default FormWrapper;