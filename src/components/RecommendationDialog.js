import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";

const ModalRoot = {
    pointerEvents: "auto",
    //"padding": "30px 35px",
    //"position": "absolute",
    "height": "150px",
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

  const modalText = {
    "fontFamily": "Roboto",
    "fontStyle": "normal",
    "fontWeight": "normal",
    "fontSize": "14px",
    "lineHeight": "133%",
    "color": "#333333"
  }

  const button = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "position": "static",
    "width": "187px",
    "height": "36px",
    "left": "0px",
    "top": "0px",
    "background": "#3DBEFF",
    "borderRadius": "100px",
    cursor: "pointer",
    marginTop: 20
  }

  const buttonText = {
    "fontFamily": "Roboto",
    "fontStyle": "normal",
    "fontWeight": "bold",
    "fontSize": "14px",
    "lineHeight": "16px",
    "display": "flex",
    "alignItems": "center",
    "textAlign": "center",
    "color": "#FFFFFF"
  }

const RecommendationDialog = () => {

  const history = useHistory();

    return (
    <div style={ModalRoot}>
        <CloseIcon onClick={() => {}} style={xButton} />
        <div style={scrollingWrapper}>
            <p style={modalText}>Not sure where to start? Try the Recommendation Tool.</p>
            <div style={button} onClick={()=>{history.push("/recommendation")}}>
                <p style={buttonText}>Recommendation Tool</p>
            </div>
        </div>
    </div>
    )
}

export default RecommendationDialog;