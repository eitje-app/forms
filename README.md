# Forms: opiononated React (web & native) forms library

This library empowers you to write feature-packed forms with only a few lines of code.rts
It exports three main components, the most important/core component being 'Form':

## Base example

```
import Form from 'initializers/form'
import {Input} from '@eitje/form-fields-web'

<Form onSubmit={data => login(data) }>
  <Input required field="email"/>
  <Input required secure field="password"/>
  <div fieldWrapper>
    <p> hello im just text </p>
    <Input required field="name"/>
  </div>
  <Button submitButton> Submit </Button>
</Form>
```             

## Idea

The Form component is the 'brain' of your form and manages the state of all fields & enhances all fields with some extra powers. 
To work efficiently, it's wise to create your own form fields components and re-use them through the application, 
for an example look in the form-fields-web GH library.

It knows which of its children are fields because they have the 'field' prop, just as in the example above. 
If you omit the field prop, the child will not be 'formified'. 

## Nested fields (fieldWrapper)

To 'formify' nested fields, you have to pass the prop fieldWrapper to the container (arbitrary HTML element). You can also pass namespace to the fieldWrapper to provide all of its field children with that namespace

## Props

| Key        | Explanation           | Default value  | 
| ------------- |:-------------:| -----:|
| initialValues     | Initial values of the form, provided as an object | {}  |
| submitInitialValues | also submits initialValues that aren't part of the form (normally, we filter out all extra initialValues to prevent you from accidentally posting data you don't want to post | false |
| onSubmit    | What to do when form is submitted, provides formData as first arg     | data => {}    |
| afterSubmit | Functions to run after submit was successfull    | () => {}  |
| afterSubmMessage | Message to display after successfull submit, will use eitje utils.toast | null
| disabled | disable whole form, prop will be passed to all children    | false    |
| nestedField | Useful if you want to edit multiple nested items in one form. This builds your nested params  |     |
| afterChange | callback you can use after any field changes. Invoked with arguments (fieldName, value)  |    |
| resetAfterSubmit | reset form to initialValues after submit | false |
| fieldProps | props to be passed down to all form children with a field prop | {} |
| hiddenFields | array of fields that should be hidden (hidden means: not visible, wont be sent along with request, wont be validated) | [] |



## Imperative actions

There are also some actions you can call directly on the form instance. You unlock this by adding a ref to your instance.

Example:

```
const ref = useRef(null)

<Form ref={ref} onSubmit={data => login(data) }>

</Form>

<Button onClick={() => ref.current.resetValues() }> 
   Reset your form
</Button>
```

Actions:

| Action        | Explanation           | Params  |
| ------------- |:-------------:| -----:|
| setValues(vals)     | Set values imperatively   | {key: value}   |
| resetValues(empty) | Reset form state to default    | If empty is false (default), form will reset to initialValues, otherwise empty object.   |
| getValue(field)    |  Get value of field |  |
| submit | Submit the form     |     |
| validate | Validate the form (renders errors) |     |
| getValues(fields | return values as object {field: value, field2: value} | array of fields
| blockSubmit(field, blocked) | blocks or de-blocks the form from submitting, automatically re-enables it after 15 seconds | field is name of the field to allow your UI components to render a special 'blocked' state, blocked is a boolean designating whether it's a block or a de-block


## MultiForm

The second component is 'MultiForm', which 'duplicates' its children.  Useful if you're editing multiple resources at the same time. 
You can pass it field children, just as you do with form, and it will render that children x amount of times (controllable by you through the amtForms prop). There's also built-in support for adding/deleting forms. An example might help:

```
<MultiForm  formProps={{styleKind: 'modal', allowEmpty: true}}  afterSubmit={onCancel} onSubmit={data => inviteUser(data)} 
                       autoAdd  amtForms={3}>
      <div className="fRow" fieldWrapper>
        <Input field="email" required/>
        <DropdownPicker  containerStyle={ContainerStyleRow} multiple field="team_ids" labelField="naam" items={teams} />
      </div>

  <Button type="primary" ignoreForm submitButton>{t('submitS')}</Button>
</MultiForm>
 ```

This MultiForm will render three forms and will automatically add another form when the last form is changed. 

# Building your own fields


## Props passed to every field



These props are passed by the form to the fields, making them 'formified', which you must implement when building your own. 

| Key        | Explanation           | Default value  |
| ------------- |:-------------:| -----:|
| onChange     | function to update the form's state, **do not override this as it will break the form** |   |
| submitForm    | Way of submitting form inside a field (useful when you want to submit on enter in an input for example)     |   |
| formData | Current state of input data    |     |
| blockSubmit | Temporarily block submitting of the form, useful if you need to wait on something like asset upload. Will auto unblock after 5 sec, blockSubmit(false) opens the submit again     |     |
| error | error text |     |
| value | current value |     |
| getNext | function to get the next form child, useful for setting focus |     |



__NOTE: Further info about field props can be found on the form-fields-web page__ 




You can use the above ^ props to build your own form fields, made even easier by the following methods:

### Easy way (HOC)

This library exports an HOC to  simplify the field building process, called `makeField`. 
This HOC renders a container and automatically sets the opacity to 0.2 when the field is disabled. Also, it renders the label & potential error.
This HOC uses the useFormField hook internally, you can also use the hooks yourself if you have more custom needs. That's explained underneath.


Example of building an input field:

```
const _Input = (props) => {
  const {value, secure, onChange, ...rest} = props
  const InputEl = secure ? AntInput.Password : AntInput

  return (
        <InputEl {...rest} value={value} onChange={e => onChange(e.target.value)}/>
    )
}

export const Input = makeField(props) 
```

Now you can import this component to make the first example work! 

### Advanced way (hooks)

This library also exports two hooks, these hooks simplify the props a bit.
You should __always__ use useFormField, usePicker only when working with a select-like input

- `useFormField: returns {error, disabled, label, value} `
- `usePicker: returns {pickerItems, selectedItem, selectedBaseItem}`

To clarify: pickerItems is an array of objects structured like `{key, label, value}`.
This way it can easily be consumed by any input without that input having to know about the structure of your record

selectedItem is the currently selected item(s) in `{key, label, value}` style, while selectedBaseItem is the original record (before conversion).







