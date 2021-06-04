import React from 'react';
import PropTypes from "prop-types";
import '../css/recommendation.css';

const RecommendationHeader = (props) => {
    return <div className="reccomendation-container">
        <ul className="progressbar">
            {props.stages.map((stage, idx) => {
                return <li style={{width: 100/props.stages.length + "%"}} key={stage} className={props.currentStage === idx ? "active" : ""}>
                    <p style={{color: "#000000"}}>{stage}</p>
                </li>
            })}
        </ul>
    </div>
}

RecommendationHeader.propTypes = {
    stages: PropTypes.array.isRequired,
    currentStage: PropTypes.number.isRequired
}

export default RecommendationHeader