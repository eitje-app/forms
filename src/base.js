import {Fragment} from 'react'

let t = text => text
let alert = text => console.log(text)
let isScoped = false
let Button = 'p'
let Prompt = null
let Tooltip = Fragment
let Wrapper = Fragment
let MultiFormWrapper = Fragment
let tooltipElement = null
let defaultIcon = null
let clearIcon = null

let config = {}

const setup = ({translatorFunc, alertFunc, scoped, button, ...rest}) => {
  if (translatorFunc) t = translatorFunc
  if (alertFunc) alert = alertFunc
  if (scoped) isScoped = scoped
  if (button) Button = button
  if (rest.Prompt) Prompt = rest.Prompt
  if (rest.Tooltip) Tooltip = rest.Tooltip
  if (rest.Wrapper) Wrapper = rest.Wrapper
  if (rest.MultiFormWrapper) MultiFormWrapper = rest.MultiFormWrapper
  if (rest.tooltipElement) tooltipElement = rest.tooltipElement
  if (rest.defaultIcon) defaultIcon = rest.defaultIcon
  if (rest.clearIcon) clearIcon = rest.clearIcon
  config = {...config, ...rest}
}
export {config, t, alert, isScoped, Button, Prompt, Tooltip, Wrapper, MultiFormWrapper, clearIcon, defaultIcon, tooltipElement}

export default setup
