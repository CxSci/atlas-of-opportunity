import React, { useState } from 'react';
import RecommendationHeader from './RecommendationHeader';
import PropTypes from "prop-types";

const root = {
    marginTop: 125
}

const descriptionText = {
    textAlign: "center"
}

const RecommendationTool = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [currentStage, setCurrentStage] = useState(0);
    return <>
        <RecommendationHeader currentStage={currentStage} stages={props.data.map(x => x.title)}/>
        <div style={root}>
            <p style={descriptionText}>{props.data[currentStage].description}</p>
            {props.data[currentStage].questions.map(question => {
                return <p style={{textAlign:"center", marginTop: 25}} key={question.question}>{question.question}</p>
            })}
        </div>
    </>
};

RecommendationTool.propTypes = {
    data: PropTypes.array.isRequired
}

export default RecommendationTool;