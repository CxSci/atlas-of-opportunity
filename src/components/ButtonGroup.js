import React, { useState } from "react";
import PropTypes from "prop-types";
import "../css/ButtonGroup.css";

const ButtonGroup = ({ defaultValue, options, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const onRadioChange = (ev) => {
    setValue(ev.target.value);
    onChange(ev.target.value);
  }

  return (
    <div className="button-group">
      {options.map(op => (
        <label className={`radio-button-wrapper ${op.value === value ? 'active' : ''}`} key={op.value}>
          <span className="radio-button">
            <input type="radio" className="radio-button-input" value={op.value} checked={op.value === value} onChange={onRadioChange} />
          </span>
          <span className="radio-button-icon">
            {op.icon}
          </span>
          <span>{op.label}</span>
        </label>
      ))}
    </div>
  )
}

ButtonGroup.propTypes = {
  defaultValue: PropTypes.any,
  options: PropTypes.arrayOf({
    label: PropTypes.string,
    value: PropTypes.string,
    icon: PropTypes.node
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ButtonGroup;
