import React from "react";
import PropTypes from 'prop-types'
const buttonRoot = {
  width: "161px",
  height: "36px",
  left: "79.5px",
  top: "0px",
  background: "#FFFFFF",
  border: "2px solid #000000",
  boxSizing: "border-box",
  borderRadius: "100px",
  margin: "auto",
  marginTop: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const buttonText = {
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "center",
  marginRight: 8,
};

const ComparisonButton = (props) => {
  return (
    <div style={{...buttonRoot, ...props.style}} onClick={props.onClick}>
      <div>
        <p style={buttonText}>Show Comparison</p>
      </div>
      <svg
        width="7"
        height="12"
        viewBox="0 0 7 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.25 0.75L6.25 6L1.25 11.25"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

ComparisonButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object
}

export default ComparisonButton