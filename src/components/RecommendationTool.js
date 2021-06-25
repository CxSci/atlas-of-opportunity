import React, { useState } from 'react';
import RecommendationHeader from './RecommendationHeader';
import PropTypes from "prop-types";
import DropdownSelect from './dropdown';
import { Fragment } from 'react';
import LozengeButton from './LozengeButton';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../css/recommendation.css';

const RecommendationTool = (props) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [formState, setFormState] = useState({});

    const setRadioValue = (key, answer) => {
        setFormState({...formState, [key]: answer});
    }

    const setCheckboxValue = (key, answer) => {
        const newArray = formState[key] ? Array.from(formState[key]) : [];
        if (newArray.includes(answer)) newArray.splice(newArray.indexOf(answer), 1);
        else newArray.push(answer);
        setFormState({...formState, [key]: newArray});
    }

    const setSelectValue = (key, answer) => {
        setFormState({...formState, [key]: answer});
    }

    const setSliderValue = (key, answer) => {
        setFormState({...formState, [key]: answer});
    }

    const inputComponentForQuestion = (question) => {
        switch (question.type) {
            case "multiple_choice":
                return <>{question.answers.map(answer =>
                    <Fragment key={answer}>
                        <label>
                            <input type="radio"
                                name={question.key}
                                onClick={()=>setRadioValue(question.key, answer)
                            }/>&nbsp;
                            <span>{answer}</span>
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
                        <label>
                            <input type="checkbox"
                                name={question.key}
                                onClick={()=>setCheckboxValue(question.key, answer)}
                            />&nbsp;
                            {answer}
                        </label>
                    </Fragment>)}</>;
            case "slider":
                return <>{
                    <Slider step={20} marks={question.answers.reduce((acc, answer, idx) => ({...acc, [idx*20]: {label: answer}}))} onChange={(val) => setSliderValue(question.key, val)}/>
                }
                </>
            default:
                return <></>
        }
    }
    

    return <>
        <RecommendationHeader currentStage={currentStage} stages={[...props.data.map(x => x.title), "Results"]}/>
        <div className="stage">
            {currentStage < props.data.length ?
                <>
                    {!props.data[currentStage].description ?
                        <></> :
                        <p className="stageDescription">{props.data[currentStage].description}</p>
                    }
                    <div className="questionList">
                        {currentStage === props.data.length ?
                            <></> :
                            props.data[currentStage].questions.map((question, idx) => {
                                return <div key={`${question.question}-${idx}`} className={`question ${question.question ? "" : "continued"}`}>
                                    <p className="description">
                                        {question.question}
                                        <br/>
                                        <span className="help">{question.hint}</span>
                                    </p>
                                    <div className="inputRoot">{inputComponentForQuestion(question)}</div>
                                </div>
                            })
                        }
                    </div>
                </> :
                <>
                    <p className="stageDescription">Based on the information you provided, the following locations could be a good match:</p>
                    <ul style={{ fontSize: 18, fontWeight: 500, lineHeight: "200%" }}>
                        <li>Adelaide Hills</li>
                        <li>Barossa - Angaston</li>
                        <li>Mannum</li>
                        <li>Northgate - Oakden - Gilles Plains</li>
                    </ul>
                </>
            }
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
                    url="/comparison/401021003+405011110+407031164+402031037"
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