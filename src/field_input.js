import {buildDecoration} from './build_decoration'

const handleKeyPress = (e, {element}) => {
  if (e.key != 'Enter') return
  let {nextSibling} = element

  if (!nextSibling && element.parentElement.className.includes('eitje-form-3-row')) {
    nextSibling = element.parentElement?.nextSibling?.children[0]
  }

  if (!nextSibling) return
  while (nextSibling && !nextSibling.className) {
    // sometimes nextSibling is just 'text' and that doesn't have a className
    nextSibling = nextSibling.nextSibling
  }
  if (nextSibling.className.includes('disabled') || nextSibling.className.includes('read-only')) {
    return handleKeyPress(e, {element: nextSibling})
  }

  if (nextSibling.className.includes('eitje-form-3-field')) {
    const input = nextSibling.querySelector('input') || nextSibling.querySelector('textarea') || nextSibling.querySelector('button')
    input?.focus?.()
  } else {
    const submitButton = nextSibling.classList.contains('form-submit-button')
      ? nextSibling
      : nextSibling.querySelector('.form-submit-button')
    if (submitButton) submitButton.click()
  }
}

export const FieldInput = ({Comp, ...rest}) => {
  const label = buildDecoration({...rest, decorationType: 'label'})
  return <Comp {...rest} placeholder="..." onKeyDown={e => handleKeyPress(e, rest)} title={label} {...rest} />
}
