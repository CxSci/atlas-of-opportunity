import React from 'react';
import RecommendationTool from '../components/RecommendationTool';

const root = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#FFFFFF",
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0
}

const Recommendation = () => {
    return <div style={root}>
        <p>Recommendation Tool</p>
        <RecommendationTool/>
    </div>
};

export default Recommendation