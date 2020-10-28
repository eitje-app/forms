let t = text => text
let alert = text => console.log(text)


const setup = ({translatorFunc, alertFunc} = {}) => {
  if(translatorFunc) t = translatorFunc;
  if(alertFunc) alert = alertFunc;

}
export {t, alert}

export default setup