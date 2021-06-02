import React, { useState } from "react";
import PropTypes from "prop-types";
import "../css/ButtonGroup.css";

const ButtonGroup = ({ defaultValue, options, onChange, width = 100 }) => {
  const [value, setValue] = useState(defaultValue);

  const onRadioChange = (ev) => {
    setValue(ev.target.value);
    onChange(ev.target.value);
  }

  return (
    <div className="button-group" style={{width: `${width}px`}}>
      {options.map(op => (
        <label className={op.value === value ? 'active' : ''} key={op.value}>
          <input type="radio"
            value={op.value}
            checked={op.value === value}
            onChange={onRadioChange}
          />
          {op.icon}
          {op.label}
        </label>
      ))}
    </div>
  )
}

ButtonGroup.propTypes = {
  defaultValue: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    icon: PropTypes.node,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.number,
}

export default ButtonGroup;
