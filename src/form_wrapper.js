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

  async submit() {
    const childs = this.formChilds() 
    if(!childs.map(c => c.submitAllowed()).every(c => !!c) ) return;

    
    const allHaveKey = childs.every(c => c.props.formKey)
    let data = {} //allHaveKey ? {} : []
    childs.forEach(c => {
      let val = c.getParams()
      data[c.props.formKey] = c.getParams()
    })
    const res = this.doSubmit(data)
    if(!res) return
    
    childs.filter(c => _.isFunction(c.props.afterSubmit)).forEach(c => c.afterSubmit(data, res) )
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