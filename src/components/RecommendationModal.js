import React from 'react';

import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";

const ModalRoot = {
    pointerEvents: "auto",
    //"padding": "30px 35px",
    //"position": "absolute",
    "height": "300px",
    "left": "0px",
    "right": "0px",
    "top": "0px",
    width: "305px",
    "background": "#FFFFFF",
    "borderRadius": "5px",
    "marginBottom": "10px",
    "marginLeft": "10px"
  }
  const scrollingWrapper = {
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    height: "100%",
    width: "100%",
    padding: "30px 35px"
  }

  const xButton = {
    position: "absolute",
    right: 0,
    width: "24px", // Increase button's clickable area by 6px all around
    height: "24px",
    padding: "6px",
    margin: "6px 14px 0 0", // Adds up to be "12px 15px 0 0" relative to rendered container
    cursor: "pointer",
  };

const RecommendationModal = () => {

    return (
    <div style={ModalRoot}>
        <CloseIcon onClick={() => {}} style={xButton} />
        <div style={scrollingWrapper}>
            <p>Not sure where to start? Try the Recommendation Tool.</p>
        </div>
    </div>
    )
}

export default RecommendationModal;