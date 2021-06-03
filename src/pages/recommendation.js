import React from 'react';
import RecommendationTool from '../components/RecommendationTool';
import { ReactComponent as CloseIcon} from "../assets/closeIconPage.svg";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import {RECOMMENDATION_DUMMY_DATA} from '../constants'
const root = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#FFFFFF",
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0
}

const titleRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "padding": "30px 40px",
    borderBottom: "1px solid #CCCCCC"
}

const titleText = {
    "fontFamily": "Roboto",
    "fontStyle": "normal",
    "fontWeight": "500",
    "fontSize": "24px",
    "lineHeight": "20px",
    "color": "#000000",
  }

  const iconButton = {
    cursor: "pointer"
  }

const Recommendation = () => {
    const history = useHistory()
    return <div style={root}>
        <div style={titleRow}>
        <p style={titleText}>Recommendation Tool</p>
            <CloseIcon style={iconButton} onClick={()=>{ history.goBack() }}/>
        </div>
        <RecommendationTool data={RECOMMENDATION_DUMMY_DATA}/>
    </div>
};

export default Recommendation