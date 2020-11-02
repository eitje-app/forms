let t = text => text
let alert = text => console.log(text)
let isScoped = false;

const setup = ({translatorFunc, alertFunc, scoped} = {}) => {
  if(translatorFunc) t = translatorFunc;
  if(alertFunc) alert = alertFunc;
  if(scoped) isScoped = isScoped;

}
export {t, alert, isScoped}

export default setup