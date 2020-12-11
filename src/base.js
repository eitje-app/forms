let t = text => text
let alert = text => console.log(text)
let isScoped = false;
let Button = "p"
const setup = ({translatorFunc, alertFunc, scoped, button} = {}) => {
  if(translatorFunc) t = translatorFunc;
  if(alertFunc) alert = alertFunc;
  if(scoped) isScoped = isScoped;
  if(button) Button = button;

}
export {t, alert, isScoped, Button}

export default setup