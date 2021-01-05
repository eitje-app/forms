let t = text => text
let alert = text => console.log(text)
let isScoped = false;
let Button = "p"
let Prompt = null;

const setup = ({translatorFunc, alertFunc, scoped, button} = {}) => {
  if(translatorFunc) t = translatorFunc;
  if(alertFunc) alert = alertFunc;
  if(scoped) isScoped = scoped;
  if(button) Button = button;
  if(prompt) Prompt = prompt;

}
export {t, alert, isScoped, Button, Prompt}

export default setup