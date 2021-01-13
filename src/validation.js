import passwordValidator from 'password-validator';
import utils from '@eitje/utils'
import {t} from './base'

const phoneRegex = /^[+#*\(\)\[\]]*([0-9][ ext+-pw#*\(\)\[\]]*){6,45}$/


export const isEmail = (val) => {
  const  emailCheck = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  return !val || val.length == 0 || emailCheck.test(val.trim())
}

const isPass = val => {
  if(!val) return true
  const schema = new passwordValidator();
  schema.isMin(6).has().uppercase().lowercase().digits();
  return schema.validate(val)
}  

const fieldRules = {
  password_confirmation: (value, data) => data.password === value,
  password: value => isPass(value),
  email: value => isEmail(value),
  telefoonnummer: value => value.match(phoneRegex),
  phone: value => value.match(phoneRegex)
}

const nameRules = {
  team_image_url: (value, data) => {
    return !data['chatgroep_actief'] || utils.exists(value) || data["remote_avatar_url"]
  },
  phone: value => value.match(phoneRegex)
}



const fieldMessages = {
  password: 'incorrectPas',
  password_confirmation: 'passwordMatch',
  email: 'emailInvalid',
  phone: 'phoneInvalid',
  telefoonnummer: 'phoneInvalid',
}

const nameMessages = {
  team_image_url: "selectImage",
  phone: 'phoneInvalid',
}

export const messages = {field: fieldMessages, name: nameMessages}
export const rules = {field: fieldRules, name: nameRules}

