import React from 'react';

import LozengeButton from './LozengeButton';
import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";

const ModalRoot = {
    pointerEvents: "auto",
    background: "#FFFFFF",
    borderRadius: "5px",
    margin: "5px 5px 10px 10px",
  }
  const scrollingWrapper = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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

  const modalText = {
    fontSize: "14px",
    lineHeight: "133%",
    color: "#333333",
    marginBottom: 20,
  }

const RecommendationDialog = () => {
    return (
        <div style={ModalRoot}>
            <CloseIcon onClick={() => {}} style={xButton} />
            <div style={scrollingWrapper}>
                <p style={modalText}>Not sure where to start? Try the Recommendation Tool.</p>
                <LozengeButton
                    buttonType="prominent"
                    buttonSize="small"
                    showChevron={true}
                    url="/recommendation"
                    text="Recommendation Tool"
                />
            </div>
        </div>
    )
}

export default RecommendationDialog;