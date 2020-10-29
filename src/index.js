import setup from './base'
import configure from './form_creator'
import dutch from './i18n/nl'
import english from './i18n/en'

// console.log(nl)

const nl = {form: dutch}
const en = {form: english}
const translations = {en, nl}

export {setup, configure, translations}


