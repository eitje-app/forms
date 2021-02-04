import React, {useRef, createRef, Fragment} from 'react'
import Form from './form'
import utils from '@eitje/utils'
import _ from 'lodash'
import {t, Button, alert, Prompt} from './base'


// [0,1,2,3]

class MultiForm extends React.Component {
  constructor(props) {
    super(props)
    const {amtForms = 2} = props
    let forms = []
    _.times(amtForms, num => forms.push(num) )

    this.state = {
      amtForms,
      forms,
    }
    this.createRefs()
    this.getParams = this.getParams.bind(this)
    this.removeForm = this.removeForm.bind(this)
  }

  createRefs = (a) => {
    const {amtForms} = this.state
    _.times(amtForms, (idx) => {
      this[`child-${idx}`] = createRef()
    })
  }

  async removeForm(formNum) {
    const {forms} = this.state
    await this.setState({forms: forms.filter(f => f != formNum)})
    this[`child-${formNum}`] = null
  }

  makeForm(idx, formNum) {
    const {autoAdd, initialValue = {}, allowEmpty = true, initialValues = [], formProps = {} } = this.props
    const {amtForms} = this.state
    const relevantChildren = this.safeChildren().filter(c => !c.props.ignoreForm && !c.props.submitButton)
    const formInitial = initialValues[formNum] || initialValue

    return (
        <Form key={formNum} allowEmpty afterTouch={() => this.setState({touched: true})} fieldProps={{formIdx: idx, formNum, removeForm: () => this.removeForm(formNum), getMultiFormData: this.getParams}} {...formProps} 
              initialValues={formInitial} afterChange={(field, data) => this._afterChange(field, data, idx, formNum)} 
              ref={this[`child-${formNum}`]}> 
          {relevantChildren}
        </Form>
      )
  }

  _afterChange(field, data, idx, formNum) {
    const {afterChange, autoAdd} = this.props
    autoAdd && this.addForm(formNum)
    if(!afterChange) return;
    const allData = this.getParams()
    afterChange(field, allData)
  }

  async addForm(formNum = this.state.forms[this.state.forms.length - 1]) {
    const {amtForms, maxAmtForms, forms} = this.state
    const isLast = forms[forms.length - 1] == formNum
    if(isLast && (!maxAmtForms || maxAmtForms < forms.length)) {
      this[`child-${formNum + 1}`] = createRef()
      await this.setState({forms: [...forms, formNum + 1]})
    }
  }

  submit() {
    const {amtForms} = this.state
    const childs = this.formChildren();
    if(this.submitAllowed()) this.handleSubmit(childs);
  }

  submitAllowed() {
    return this.formChildren().every(c =>  c.submitAllowed())
  }

  setValues = (data) => {
    this.formChildren().forEach(f => {
      f.setValues(data)
    })
  }

  getParams = () => {    
    return this.formChildren().filter(c => !c.empty()).map(c => c.getParams()) 
  }

  handleSubmit = async (childs) => {
    const {onSubmit, afterSubmit = () => {}} = this.props
    const data = childs.filter(c => !c.empty()).map(c => c.state.fields).filter(c => !utils.objectEmpty(c)) // no empty forms plz
    
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
    const {forms} = this.state
    return forms.map(i => this[`child-${i}`]?.current )
  }

  safeChildren() {
    const {children} = this.props
    return utils.alwaysDefinedArray(children)
  }

  render() {
    const {AddButton = Button, hideAddButton} = this.props
    const {amtForms, forms, touched} = this.state
    const submitButton = this.safeChildren().find(c => c.props?.submitButton)
    return (
        <Fragment>
          {forms.map((f, idx) => this.makeForm(idx, f))}
          {!!submitButton && (!submitButton.props.showAfterTouch || touched) && React.cloneElement(submitButton, {onClick: () => this.submit()}) }
          {!hideAddButton && <AddButton onClick={() => this.addForm() }> Add  </AddButton>}
        </Fragment>
      )
  }
}

export default MultiForm
