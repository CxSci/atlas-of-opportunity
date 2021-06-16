import React from "react";
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

const buttonRoot = {
  boxSizing: "border-box",
  borderRadius: "1000px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  textAlign: "center",
};

const buttonStyles = {
  normal: {
    background: "#FFFFFF",
    border: "2px solid #000000",
    fontWeight: 500,
  },
  prominent: {
    background: "#3DBEFF",
    border: "none",
    fontWeight: 700,
    lineHeight: "19px",
    color: "#FFFFFF",
  },
  small: {
    padding: "9px 14px 8px 14px",
    fontSize: "14px",    
  },
  medium: {
    padding: "10px 15px",
    fontSize: "16px",
  },
}

const chevronStyles = {
  normal: {
    stroke: "black",
  },
  prominent: {
    stroke: "white",
  },
  small: {
    strokeWidth: 1.5,
  },
  medium: {
    strokeWidth: 2,
  },
}

const LozengeButton = (props) => {
  const buttonStyle = {
    ...buttonStyles[props.buttonType || "normal"],
    ...buttonStyles[props.buttonSize || "small"]
  }
  const chevronStyle = {
    ...chevronStyles[props.buttonType || "normal"],
    ...chevronStyles[props.buttonSize || "small"]
  }

  return (
    <Link to={props.url || ""}
      onClick={
        props.onClick ? event => {
          event.stopPropagation();
          event.preventDefault();
          props.onClick()
        } : undefined}
      style={{...buttonRoot, ...buttonStyle, ...props.style}}
    >
      {props.text || "Show Comparison"}
      {props.showChevron ? <svg
        width="15"
        height="13"
        viewBox="0 0 15 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.25 0.75L14.25 6L9.25 11.25"
          style={chevronStyle}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg> : <></>}
    </Link>
  );
};

LozengeButton.propTypes = {
  buttonType: PropTypes.string,
  buttonSize: PropTypes.string,
  style: PropTypes.object, // optional style overrides
  text: PropTypes.string,
  onClick: PropTypes.func,
  showChevron: PropTypes.bool,
  url: PropTypes.string,
}

export default LozengeButton