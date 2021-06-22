import React from 'react';
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getHiddenSidebarDialogs } from "../redux/getters";
import { hideSidebarDialog } from "../redux/action-creators";

import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";

const dialogStyle = {
  pointerEvents: "auto",
  background: "#FFFFFF",
  borderRadius: "5px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25), 0px -1px 0px rgba(0, 0, 0, 0.1)",
  margin: "0px 5px 10px 10px",
  display: "flex",
  flexDirection: "column",
  fontSize: "14px",
  lineHeight: "140%",
}
const contentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "30px 35px",
  overflow: "auto",
}

const xButtonStyle = {
  position: "absolute",
  right: 0,
  width: "24px", // Increase button's clickable area by 6px all around
  height: "24px",
  padding: "6px",
  margin: "8px 14px 0 0", // Adds up to be "12px 15px 0 0" relative to rendered container
  cursor: "pointer",
};

const SidebarDialog = (props) => {
  const {
    id,
    style = {},
    greedyHeight = false } = props;
  const hiddenDialogs = useSelector(getHiddenSidebarDialogs)
  const hideDialog = () => hideSidebarDialog(id)

  return (
    hiddenDialogs.indexOf(id) === -1 ?
    <div style={{...dialogStyle, ...(!greedyHeight && {overflow: "hidden"})}}>
      <CloseIcon onClick={hideDialog} style={xButtonStyle} />
      <div style={{...contentStyle, ...style}}>
        {props.children}
      </div>
    </div>
    : <></>
  )
}

SidebarDialog.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  greedyHeight: PropTypes.bool,
  style: PropTypes.object,
}

export default SidebarDialog;