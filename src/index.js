import setup from './base'
import configure from './form_creator'
import dutch from './i18n/nl'
import english from './i18n/en'
import useFormField from './use_form_field'
import usePicker from './use_picker'
import MultiForm from './multi_form'
// console.log(nl)

const nl = {form: dutch}
const en = {form: english}
const translations = {en, nl}

export {setup, configure, translations, useFormField, usePicker, MultiForm}

Object.assign(module.exports, require('./actions'));
Object.assign(module.exports, require('./components'));

