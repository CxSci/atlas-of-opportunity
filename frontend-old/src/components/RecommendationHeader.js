import React from 'react';
import PropTypes from "prop-types";
import '../css/recommendation.css';

const RecommendationHeader = (props) => {
    return <ul className="progressBar">
        {props.stages.map((stage, idx) => {
            return <li key={stage} className={`${props.currentStage > idx ? "completed" : ""} ${props.currentStage === idx ? "active" : ""}`}>
                <div className="progressGraphic">
                    <div className="progressBubble" />
                </div>
                <p>{stage}</p>
            </li>
        })}
    </ul>
}

RecommendationHeader.propTypes = {
    stages: PropTypes.array.isRequired,
    currentStage: PropTypes.number.isRequired
}

export default RecommendationHeader