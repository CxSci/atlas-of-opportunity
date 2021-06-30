import React, { useState } from 'react';
import RecommendationHeader from './RecommendationHeader';
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getANZSICCodes } from "../redux/getters";
import DropdownSelect from './dropdown';
import TypeaheadSelect from './TypeaheadSelect';
import { Fragment } from 'react';
import LozengeButton from './LozengeButton';
import { Range } from 'rc-slider';

import 'rc-slider/assets/index.css';
import '../css/recommendation.css';

const RecommendationTool = (props) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [formState, setFormState] = useState({});

    const anzsicCodes = useSelector(getANZSICCodes);
    const [anzsicAnswers] = useState(() => {
        const uniqueDivisionCodes = new Set()
        const uniqueSubdivisionCodes = new Set()
        const uniqueGroupCodes = new Set()

        return anzsicCodes.reduce((result, code) => {
            // Create a new division-level entry if needed
            if (!uniqueDivisionCodes.has(code.division_code)) {
                uniqueDivisionCodes.add(code.division_code)
                result.push(`${code.division_code}: ${code.division_title}`)
            }
            // Create a new subdivision-level entry if needed
            if (!uniqueSubdivisionCodes.has(code.division_code)) {
                result.push(`${code.subdivision_code}: ${code.subdivision_title}`)
                uniqueSubdivisionCodes.add(code.division_code)
            }
            // Create a new group-level entry if needed
            if (!uniqueGroupCodes.has(code.division_code)) {
                result.push(`${code.group_code}: ${code.group_title}`)
                uniqueGroupCodes.add(code.division_code)
            }
            // Create a class-level entry
            result.push(`${code.class_code}: ${code.class_title}`)
            return result
        }, [])
    })

    const setRadioValue = (key, answer) => {
        setFormState({...formState, [key]: answer});
    }

    const setCheckboxValue = (key, answer) => {
        const newArray = formState[key] ? Array.from(formState[key]) : [];
        if (newArray.includes(answer)) {
            newArray.splice(newArray.indexOf(answer), 1);
        }
        else {
            newArray.push(answer);
        }
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
                    items={[question.placeholder, ...question.answers]}
                    selectedItem={formState[question.key] || question.placeholder}
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
            case "slider_range":
                return <>{
                    <Range
                        // Each mark is a step.
                        step={null}
                        // Must be in the form { 0: "Foo" }, where 0 is where
                        // the mark should appear on the slider from 0 to 100.
                        marks={question.answers}
                        defaultValue={[0, 100]}
                        onAfterChange={(val) => {
                            setSliderValue(question.key, val.map(v => question.answers[v]))}}
                    />
                }
                </>
            case "typeahead_select":
                return <TypeaheadSelect
                    items={(question.key == "anzsic_code") ? anzsicAnswers : question.answers}
                    placeholder="Search by business category or ANZSIC code"
                    handleSelectionChanged={value => {console.log(value)}}
                    />
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
                                    {(question.question) &&
                                        <p className="description">
                                            {question.question}
                                            <br/>
                                            <span className="help">{question.hint}</span>
                                        </p>
                                    }
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