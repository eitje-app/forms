import {Button, Tooltip, t, tooltipElement, defaultIcon, clearIcon as clearIconImg} from './base'

export const RightContent = ({icon = defaultIcon, onChange, clearIcon, defaultPickerValue}) => {
  const hide = !icon && !clearIcon
  if (hide) return
  return (
    <div className="form-field-content-right">
      {icon && <img className="eitje-form-field-3-icon" src={icon} />}
      {clearIcon && <img className="eitje-form-field-3-clear-icon" src={clearIconImg} onClick={() => onChange(defaultPickerValue)} />}
    </div>
  )
}
