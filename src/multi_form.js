import React, {useRef, createRef, Fragment} from 'react'
import Form from './form'
import utils from '@eitje/utils'
import _ from 'lodash'
import {t, Button, alert, Prompt, MultiFormWrapper} from './base'
import {debounce} from './utils'


class MultiForm extends React.Component {
  constructor(props) {
    super(props)
    const {amtForms = 2} = props
    let forms = []
    _.times(amtForms, (num) => forms.push(num))

    this.state = {
      amtForms,
      forms,
    }
    this.createRefs()
    this.getParams = this.getParams.bind(this)
    this.removeForm = this.removeForm.bind(this)
    this.addForm = this.addForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmit = debounce(this.handleSubmit, 1500, true)
  }

  createRefs = (a) => {
    const {amtForms} = this.state
    _.times(amtForms, (idx) => {
      this[`child-${idx}`] = createRef()
    })
  }

  async removeForm(formNum) {
    const {forms} = this.state
    await this.setState({forms: forms.filter((f) => f != formNum)})
    this[`child-${formNum}`] = null
  }

  makeAddDel() {}

  mayAdd() {
    const {maxForms} = this.props
    const {forms} = this.state
    return forms.length < maxForms
  }

  makeForm(idx, formNum) {
    const {
      autoAdd,
      initialValue = {},
      afterRemove = _.noop,
      hideControls,
      allowEmpty = true,
      initialValues = [],
      formProps = {},
    } = this.props
    const {forms} = this.state
    const formInitial = initialValues[formNum] || initialValue

    let condProps = {}

    const isFirst = idx == 0
    const isLast = idx == forms.length - 1

    const removeForm = async () => {
      await this.removeForm(formNum)
      afterRemove(idx)
      this.updateParentForm()
    }

    const relevantChildren = this.safeChildren({removeForm, isLast, isFirst}).filter(
      (c) => !c.props.ignoreForm && !c.props.submitButton && !c.props.addButton,
    )

    const deleter = (
      <p className="multi-form-deleter" style={{transform: 'rotate(45deg)'}} onClick={removeForm}>
        +
      </p>
    )
    const adder = (
      <p className="multi-form-adder" onClick={() => this.addForm()}>
        +
      </p>
    )
    const rightChildren = [forms.length > 1 && deleter, isLast && this.mayAdd() && adder].filter(Boolean)

    if (!hideControls && relevantChildren.length == 1) {
      // for now, well only allow this for forms with only one field
      condProps['rightChildren'] = rightChildren
      condProps['isLayered'] = true
    }

    return (
      <Form
        key={formNum}
        allowEmpty={allowEmpty}
        afterTouch={() => this.setState({touched: true})}
        fieldProps={{
          formIdx: idx,
          mayAdd: this.mayAdd(),
          isFirst,
          isLast,
          addForm: () => this.addForm(),
          amtForms: forms.length,
          formNum,
          removeForm,
          getMultiFormData: this.getParams,
          ...condProps,
        }}
        initialValues={formInitial}
        afterChange={(field, data) => this._afterChange(field, data, idx, formNum)}
        {...formProps}
        ref={this[`child-${formNum}`]}
      >
        {relevantChildren}
      </Form>
    )
  }

  _afterChange(field, data, idx, formNum, onChange) {
    const {afterChange, autoAdd} = this.props
    this.updateParentForm()
    autoAdd && this.addForm(formNum)
    if (!afterChange) return
    const allData = this.getParams()
    afterChange(field, allData)
  }

  updateParentForm = () => {
    const {field, onChange} = this.props
    if (!field || !onChange) return
    onChange(this.getParams())
  }

  async addForm(formNum = this.state.forms[this.state.forms.length - 1]) {
    const {amtForms, maxForms, forms} = this.state
    const isLast = forms[forms.length - 1] == formNum
    if (isLast && (!maxForms || maxForms < forms.length)) {
      this[`child-${formNum + 1}`] = createRef()
      await this.setState({forms: [...forms, formNum + 1]})
    }
  }

  submit() {
    const {amtForms} = this.state
    if (this.submitAllowed()) this.handleSubmit()
  }

  submitAllowed = () => {
    return this.formChildren().every((c) => c.submitAllowed())
  }

  validate = this.submitAllowed

  setValues = (data) => {
    this.formChildren().forEach((f) => {
      f.setValues(data)
    })
  }

  getParams = () => {
    return this.formChildren()
      .filter((c) => !c.empty())
      .map((c) => c.getParams())
      .filter((c) => !utils.objectEmpty(c))
  }

  handleSubmit = async (childs = this.formChildren()) => {
    const {onSubmit, afterSubmit = () => {}} = this.props
    const data = this.getParams()

    if (data.length === 0) {
      alert(t('oops'), t('form.fillInSomething')) // must become alert
      return
    }

    const res = await onSubmit(data)
    if (res === true || res?.ok) {
      // explicit true check because we want to prevent truthy values like {error: true} to pass
      this.afterSubmit(res, data)
      afterSubmit(res, data)
    }
  }

  afterSubmit(res, data) {
    this.formChildren()
      .filter((c) => c.afterSubmit)
      .forEach((c) => c.afterSubmit(res, data))
  }

  formChildren() {
    const {forms} = this.state
    return forms.map((i) => this[`child-${i}`]?.current).filter(Boolean)
  }

  getChildren(props) {
    const {children} = this.props
    const {addForm} = this
    const _addForm = () => addForm() // we dont wanna allow args..
    const actualChilds = utils.funcOrVal(children, {addForm: this.mayAdd() && _addForm, ...props})
    return actualChilds
  }

  safeChildren(props = {}) {
    const {children} = this.props
    const childs = this.getChildren(props)
    return utils.alwaysDefinedArray(childs)
  }

  render() {
    const {AddButton = Button, hideAddButton = true} = this.props
    const {amtForms, forms, touched} = this.state
    const submitButton = this.safeChildren().find((c) => c.props?.submitButton)
    return (
      <MultiFormWrapper>
        {forms.map((f, idx) => this.makeForm(idx, f))}
        {!!submitButton &&
          (!submitButton.props.showAfterTouch || touched) &&
          React.cloneElement(submitButton, {onClick: () => this.submit()})}
        {!hideAddButton && <AddButton onClick={() => this.addForm()}> Add </AddButton>}
      </MultiFormWrapper>
    )
  }
}

export default MultiForm
