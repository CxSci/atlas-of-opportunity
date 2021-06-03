import React, { useState } from 'react';
import RecommendationHeader from './RecommendationHeader';
import PropTypes from "prop-types";
import DropdownSelect from './dropdown';

const root = {
    marginTop: 125
}

const descriptionText = {
    textAlign:"center", 
    marginTop: 25,
    marginBottom: 25
}

const helpText = {
    marginTop: -15,
    marginBottom: 25,
    textAlign: "center",
    fontStyle: "italic"
}

const inputRoot = {
    margin: "auto",
    width: "max-content"
}

const nextButton = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "position": "absolute",
    "width": "64px",
    "height": "39px",
    "right": "40px",
    "bottom": "30px",
    "background": "#3DBEFF",
    "borderRadius": "100px",
    "cursor": "pointer"
}

const previousButton = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "position": "absolute",
    "width": "94px",
    "height": "39px",
    "left": "40px",
    "bottom": "30px",
    "background": "#3DBEFF",
    "borderRadius": "100px",
    "cursor": "pointer"
}

const buttonText = {
    "fontFamily": "Roboto",
    "fontStyle": "normal",
    "fontWeight": "bold",
    "fontSize": "16px",
    "lineHeight": "19px",
    "color": "#FFFFFF"
}

const labelRoot = {
    display: "block"
}

const RecommendationTool = (props) => {
    // eslint-disable-next-line no-unused-vars
    const [currentStage, setCurrentStage] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [formState, setFormState] = useState({});
    return <>
        <RecommendationHeader currentStage={currentStage} stages={props.data.map(x => x.title)}/>
        <div style={root}>
            <p style={descriptionText}>{props.data[currentStage].description}</p>
            {props.data[currentStage].questions.map(question => {
                let inputComponent = <></>
                switch (question.type) {
                    case "multiple_choice":
                        inputComponent = <>{question.answers.map(answer => <><label key={answer} style={labelRoot}><input type="radio"/>{answer}</label><br/></>)}</>;
                        break;
                    case "select":
                        inputComponent = <DropdownSelect
                            items={question.answers}
                            initialSelectedItem={""}
                            handleSelectionChanged={()=>{}}
                        />;
                        break;
                    case "checkbox":
                        inputComponent = <>{question.answers.map(answer => <><label key={answer} style={labelRoot}><input type="checkbox"/>{answer}</label><br/></>)}</>;
                        break;
                    default:
                        break;
                }
                return <div key={question.question}>
                    <p style={descriptionText}>{question.question}</p>
                    <p style={helpText}>{question.hint}</p>
                    <div style={inputRoot}>{inputComponent}</div>
                </div>
            })}
            {currentStage !== props.data.length - 1 && <div style={nextButton} onClick={() => {setCurrentStage(currentStage + 1)}}><p style={buttonText}>Next</p></div>}
            {currentStage !== 0 && <div style={previousButton} onClick={() => {setCurrentStage(currentStage - 1)}}><p style={buttonText}>Previous</p></div>}
        </div>
    </>
};

RecommendationTool.propTypes = {
    data: PropTypes.array.isRequired
}

export default RecommendationTool;