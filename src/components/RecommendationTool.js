import React, { useState } from 'react';
import RecommendationHeader from './RecommendationHeader';
import PropTypes from "prop-types";
import DropdownSelect from './dropdown';
import { Fragment } from 'react';
import LozengeButton from './LozengeButton';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import '../css/recommendation.css';

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
            {(currentStage === props.data.length || !props.data[currentStage].description) ?
                <></> :
                <p className="stageDescription">{props.data[currentStage].description}</p>
            }
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
        </div>
        <div className="actions">
            {currentStage !== 0 &&
                <LozengeButton
                    buttonType="prominent"
                    buttonSize="medium"
                    onClick={() => {setCurrentStage(currentStage - 1)}}
                    text="Previous"
                />
            }
            {currentStage !== props.data.length &&
                <LozengeButton
                    buttonType="prominent"
                    buttonSize="medium"
                    onClick={() => {setCurrentStage(currentStage + 1)}}
                    text="Next"
                />
            }
            {currentStage === props.data.length &&
                <LozengeButton
                    buttonType="prominent"
                    buttonSize="medium"
                    showChevron={true}
                    onClick={()=>{history.goBack()}}
                    text="Compare Locations"
                />
            }
        </div>
    </>
};

RecommendationTool.propTypes = {
    data: PropTypes.array.isRequired
}

export default RecommendationTool;