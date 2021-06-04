import React, { useState } from 'react';
import RecommendationHeader from './RecommendationHeader';
import PropTypes from "prop-types";
import DropdownSelect from './dropdown';
import { Fragment } from 'react';

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
    const [currentStage, setCurrentStage] = useState(0);
    const [formState, setFormState] = useState({});

    const setRadioValue = (key, answer) => {
        setFormState({...formState, [key]: answer})
    }

    const setCheckboxValue = (key, answer) => {
        const newArray = formState[key] ? Array.from(formState[key]) : [];
        if (newArray.includes(answer)) newArray.splice(newArray.indexOf(answer), 1);
        else newArray.push(answer);
        setFormState({...formState, [key]: newArray});
    }

    const setSelectValue = (key, answer) => {
        setFormState({...formState, [key]: answer})
    }
    return <>
        <RecommendationHeader currentStage={currentStage} stages={props.data.map(x => x.title)}/>
        <div style={root}>
            <p style={descriptionText}>{props.data[currentStage].description}</p>
            {props.data[currentStage].questions.map(question => {
                let inputComponent = <></>
                switch (question.type) {
                    case "multiple_choice":
                        inputComponent = <>{question.answers.map(answer => <Fragment key={answer}><label style={labelRoot}><input type="radio" name={question.key} onClick={()=>setRadioValue(question.key, answer)}/>{answer}</label><br/></Fragment>)}</>;
                        break;
                    case "select":
                        inputComponent = <DropdownSelect
                            items={question.answers}
                            initialSelectedItem={""}
                            handleSelectionChanged={(value)=>{setSelectValue(question.key, value)}}
                        />;
                        break;
                    case "checkbox":
                        inputComponent = <>{question.answers.map(answer => <Fragment key={answer}><label style={labelRoot}><input type="checkbox" name={question.key} onClick={()=>setCheckboxValue(question.key, answer)}/>{answer}</label><br/></Fragment>)}</>;
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