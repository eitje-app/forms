# Forms: opiononated React (web & native) forms library

This library empowers you to write feature-packed forms with only a few lines of code.

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
If you omit the field prop, the child will not be 'formified'. To 'formify' nested fields, you have to pass the prop fieldWrapper to the container.

## Props

| Key        | Explanation           | Default value  |
| ------------- |:-------------:| -----:|
| initialValues     | Initial values of the form, provided as an object | {}  |
| onSubmit    | What to do when form is submitted, provides formData as first arg     | data => {}    |
| afterSubmit | Functions to run after submit was successfull    | () => {}    |
| disabled | disable whole form, prop will be passed to all children    | false    |
| nestedField | Useful if you want to edit multiple nested items in one form. This builds your nested params  |     |


## Field props

We have two sets of props here. The first are props you can give to any form field when rendering, which will affect how the form handles its fields:

| Key        | Explanation           | Default value  |
| ------------- |:-------------:| -----:|
| field     | name of the field in formData, will also be used for validations  |   |
| name | More granular control: validation will first look for the name prop before looking for the field prop. This way you can have different validations for the same field in different places     |     |
| required    |  is this field required for submitting?  |  false |
| validate | Custom validation function with (formData, field) as arguments     |     |
| validateMessage | Custom validation message |     |
| disabled | disabled can be a bool or a function that takes formData as first argument |     |
| label | Label to be rendered alongside the field, defaults to showing a p tag with name OR field  |     |
| label | Label to be rendered alongside the field, defaults to showing a p tag with name OR field  |     |


__NOTE: Further info about props for specific fields can be found on the form-fields-web page__ 

The second are props passed by the form to the fields, making them 'formified', which you can use when building your own. 

| Key        | Explanation           | Default value  |
| ------------- |:-------------:| -----:|
| onChange     | function to update the form's state, **do not override this as it will break the form** |   |
| submitForm    | Way of submitting form inside a field (useful when you want to submit on enter in an input for example)     |   |
| formData | Current state of input data    |     |
| blockSubmit | Temporarily block submitting of the form, useful if you need to wait on something like asset upload. Will auto unblock after 5 sec, blockSubmit(false) opens the submit again     |     |
| error | error text |     |
| value | current value |     |
| getNext | function to get the next form child, useful for setting focus |     |



## Building your own fields

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







