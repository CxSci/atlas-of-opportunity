import React from "react";
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

const buttonRoot = {
  background: "#FFFFFF",
  border: "2px solid #000000",
  boxSizing: "border-box",
  borderRadius: "100px",
  marginTop: 15,
  display: "flex",
  alignItems: "center",
  alignSelf: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "center",
  padding: "9px 14px 8px 14px",
};

const ComparisonButton = (props) => {
  return (
    <Link to="/comparison" style={{...buttonRoot, ...props.style}}>
      Show Comparison
      <svg
        width="15"
        height="13"
        viewBox="0 0 15 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.25 0.75L14.25 6L9.25 11.25"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
};

ComparisonButton.propTypes = {
  style: PropTypes.object
}

export default ComparisonButton