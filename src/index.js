import setup, {config, t} from './base'
import configure from './form_creator'
import dutch from './i18n/nl'
import english from './i18n/en'
import useFormField from './use_form_field'
import usePicker from './use_picker'
import MultiForm, {useMultiForm} from './multi_form'
import LegacyMultiForm from './legacy_multi_form'
import FormWrapper from './form_wrapper'
import Form from './form'
import ContextForm, {useForm} from './context_form'

export {NewForm} from './new_form'
export {makeField} from './actions'
export {makeLegacyField} from './legacy_actions'
export {FieldGroup} from './components'
export {useRegisterField, makeRegisteredField, useNewRegisterField, makeNewRegisteredField} from './use_register_field'
export {decorateField, makeNewField} from './build_field'
export {useFormSelector, useFieldValue} from './context'

const nl = {form: dutch}
const en = {form: english}
const translations = {en, nl}

export {
  setup,
  configure,
  LegacyMultiForm,
  translations,
  useForm,
  useMultiForm,
  ContextForm,
  useFormField,
  usePicker,
  MultiForm,
  Form,
  FormWrapper,
  t,
  config,
}
