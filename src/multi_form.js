import React, {useRef, createRef, Fragment} from 'react'
import Form from './form'
import utils from '@eitje/utils'
import _ from 'lodash'
import {t, Button, alert, Prompt} from './base'

class MultiForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amtForms: props.amtForms || 2,
    }
    this.createRefs()
  }

  createRefs = (a) => {
    const {amtForms} = this.state
    _.times(amtForms, (idx) => {
      this[`child-${idx}`] = createRef()
    })
  }

  makeForm(idx) {
    const {autoAdd, initialValues = [], formProps = {} } = this.props
    const {amtForms} = this.state
    const relevantChildren = this.safeChildren().filter(c => !c.props.ignoreForm && !c.props.submitButton)
    const formInitial = initialValues[idx]
    return (
        <Form afterTouch={() => this.setState({touched: true})} {...formProps} initialValues={formInitial} afterChange={(field, data) => this._afterChange(field, data, idx)} 
              onFocus={() => autoAdd && this.addForm(idx)} ref={this[`child-${idx}`]}>
          {relevantChildren}
        </Form>
      )
  }

  _afterChange(field, data, idx) {
    const {afterChange} = this.props
    if(!afterChange) return;
    const allData = this.getParams()
    afterChange(field, allData)
  }

  async addForm(idx) {
    const {amtForms, maxAmtForms} = this.state
    const isLast = idx + 1 === amtForms
    if(isLast && (!maxAmtForms || maxAmtForms < amtForms)) {
      this[`child-${amtForms}`] = createRef()
      await this.setState({amtForms: amtForms + 1})
    }
  }

  submit() {
    const {amtForms} = this.state
    const childs = this.formChildren();
    const mayPass = childs.every(c => c.submitAllowed())
    if(mayPass) this.handleSubmit(childs);
  }

  setValues = (data) => {
    this.formChildren().forEach(f => {
      f.setValues(data)
    })
  }

  getParams = () => {
    return this.formChildren().map(c => c.getParams())
  }

  handleSubmit = async (childs) => {
    const {onSubmit, afterSubmit = () => {}} = this.props
    const data = childs.map(c => c.state.fields).filter(c => !utils.objectEmpty(c)) // no empty forms plz
    
    if(data.length === 0) {
      alert(t("oops"), t("fillInSomething")) // must become alert
      return;
    }

    const res = await onSubmit(data)
    if(res === true || res?.ok) { // explicit true check because we want to prevent truthy values like {error: true} to pass
      afterSubmit(res, data)
    }
  }



  formChildren() {
    const {amtForms} = this.state
    let items = []
    _.times(amtForms, i => {
      const form = this[`child-${i}`]
      items.push(form.current)
    })
    return items;
  }

  safeChildren() {
    const {children} = this.props
    return utils.alwaysDefinedArray(children)
  }

  render() {
    const {amtForms, touched} = this.state
    const submitButton = this.safeChildren().find(c => c.props?.submitButton)
    return (
        <Fragment>
          {_.times(amtForms, idx => this.makeForm(idx) )}
          {!!submitButton && (!submitButton.props.showAfterTouch || touched) && React.cloneElement(submitButton, {onClick: () => this.submit()}) }
        </Fragment>
      )
  }
}

export default MultiForm
