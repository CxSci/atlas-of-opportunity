import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import '../css/ModalContainer.css'

import { ReactComponent as CloseIcon} from "../assets/closeIconPage.svg";

const ModalContainer = (props) => {
  const { title, children } = props;
  const history = useHistory();

  const modalContainer = {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 3,
    display: "flex",
    justifyContent: "center",
  }

  const dimScreen = {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: "rgba(0, 0, 0, 0.5)",
    pointerEvents: "auto",
  };

  const container = {
    zIndex: 0,
    display: "flex",
    margin: 60,
    flexDirection: "column",
    justifyContent: "center",
    flex: "1 1 680px",
    maxWidth: 680,
    // Don't let padding, margin, or flex sizing block clickthroughs to dimScreen.
    pointerEvents: "none",
  }

  const dialog = {
    display:"flex",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    flexDirection: "column",
    pointerEvents: "auto",
    overflowY: "auto",
  };

  const titleBox = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    lineHeight: "20px",
    padding: "30px 40px 20px 40px",
    borderBottom: "1px solid #CCC",  
    width:"100%",
    fontSize: "24px",
    fontWeight: "500"
  };

  const childrenContent = {
    padding: "20px 40px",
    overflowY: "auto",
  }

  const iconButton = {
    cursor: "pointer"
  }

  return (
    <div className="modalContainer" style={modalContainer}>
      <div
        onClick={history.goBack}
        style={dimScreen}
      />
      <div style={container}>
        <div style={dialog}>
          <h3 style={titleBox}>
            {title}
            <CloseIcon style={iconButton} onClick={history.goBack}/>
          </h3>  
          <div className="modalContainerContent" style={childrenContent}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

ModalContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ModalContainer;
