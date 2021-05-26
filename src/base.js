import {Fragment} from 'react'

let t = text => text
let alert = text => console.log(text)
let isScoped = false;
let Button = "p"
let Prompt = null;
let Tooltip = Fragment

const setup = ({translatorFunc, alertFunc, scoped, button, ...rest}) => {
  if(translatorFunc) t = translatorFunc;
  if(alertFunc) alert = alertFunc;
  if(scoped) isScoped = scoped;
  if(button) Button = button;
  if(rest.Prompt) Prompt = rest.Prompt;
  if(rest.Tooltip) Tooltip = rest.Tooltip;
}
export {t, alert, isScoped, Button, Prompt, Tooltip}

export default setup