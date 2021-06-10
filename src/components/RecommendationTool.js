import React, { useState } from 'react';
import RecommendationHeader from './RecommendationHeader';
import PropTypes from "prop-types";
import DropdownSelect from './dropdown';
import { Fragment } from 'react';
import ComparisonButton from './ComparisonButton';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import '../css/recommendation.css';

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
    "cursor": "pointer",
    border: "none"
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
    "cursor": "pointer",
    border: "none",

}

const comparisonButton = {
    "position": "absolute",
    "width": "186px",
    "height": "39px",
    "right": "40px",
    "bottom": "30px",
    "background": "#3DBEFF",
    "borderRadius": "100px",
    cursor: "pointer",
    border: "none"
}

const buttonText = {
    "fontFamily": "Roboto",
    "fontStyle": "normal",
    "fontWeight": "bold",
    "fontSize": "16px",
    "lineHeight": "19px",
    "color": "#FFFFFF"
}

const RecommendationTool = (props) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [formState, setFormState] = useState({});
    const history = useHistory();

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

    const inputComponentForQuestion = (question) => {
        switch (question.type) {
            case "multiple_choice":
                return <>{question.answers.map(answer =>
                    <Fragment key={answer}>
                        <label className="labelRoot">
                            <input type="radio"
                                name={question.key}
                                onClick={()=>setRadioValue(question.key, answer)
                            }/>&nbsp;
                            {answer}
                        </label>
                    </Fragment>)}</>;
            case "select":
                return <DropdownSelect
                    items={question.answers}
                    initialSelectedItem={""}
                    handleSelectionChanged={(value)=>{setSelectValue(question.key, value)}}
                    />;
            case "checkbox":
                return <>{question.answers.map(answer =>
                    <Fragment key={answer}>
                        <label className="labelRoot">
                            <input type="checkbox"
                                name={question.key}
                                onClick={()=>setCheckboxValue(question.key, answer)}
                            />&nbsp;
                            {answer}
                        </label>
                    </Fragment>)}</>;
            default:
                return <></>
        }
    }

    return <>
        <RecommendationHeader currentStage={currentStage} stages={props.data.map(x => x.title)}/>
        <div className="stage">
            <p className="stageDescription">{currentStage === props.data.length ? <></> : props.data[currentStage].description}</p>
            <div className="questionList">
                {currentStage === props.data.length ? <></> : props.data[currentStage].questions.map((question, idx) => {
                    return <div key={`${question.question}-${idx}`} className={`question ${question.question ? "" : "continued"}`}>
                        <p className="description">
                            {question.question}
                            <p className="help">{question.hint}</p>
                        </p>
                        <div className="inputRoot">{inputComponentForQuestion(question)}</div>
                    </div>
                })}
            </div>
            
            {currentStage !== props.data.length && <ComparisonButton textStyle={buttonText} noChevron style={nextButton} onClick={() => {setCurrentStage(currentStage + 1)}} text="Next"/>}
            {currentStage !== 0 && <ComparisonButton textStyle={buttonText} noChevron style={previousButton} onClick={() => {setCurrentStage(currentStage - 1)}} text="Previous"/>}
            {currentStage === props.data.length && <ComparisonButton chevronColor="white" textStyle={buttonText} style={comparisonButton} onClick={()=>{history.goBack()}} text="Compare Locations"/>}
        </div>
    </>
};

RecommendationTool.propTypes = {
    data: PropTypes.array.isRequired
}

export default RecommendationTool;