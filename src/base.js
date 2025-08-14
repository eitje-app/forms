import {Fragment} from 'react'
import {t} from '@eitje/bridge'

let Prompt = null
let Tooltip = Fragment
let Wrapper = Fragment
let clearIcon = null

let config = {}

const setup = ({translatorFunc, alertFunc, scoped, button, ...rest}) => {
  if (rest.Prompt) Prompt = rest.Prompt
  if (rest.Tooltip) Tooltip = rest.Tooltip
  if (rest.Wrapper) Wrapper = rest.Wrapper
  if (rest.clearIcon) clearIcon = rest.clearIcon
  config = {...config, ...rest}
}
export {config, t, Prompt, Tooltip, Wrapper, clearIcon}

export default setup
