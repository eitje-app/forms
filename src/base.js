import {Fragment} from 'react'

let t = (text) => text
let alert = (text) => console.log(text)
let isScoped = false
let Button = 'p'
let Prompt = null
let Tooltip = Fragment
let Wrapper = Fragment
let MultiFormWrapper = Fragment
let tooltipElement = null

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
}
export {t, alert, isScoped, Button, Prompt, Tooltip, Wrapper, MultiFormWrapper, tooltipElement}

export default setup
