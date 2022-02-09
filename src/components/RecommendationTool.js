import React, { useState } from 'react';
import RecommendationHeader from './RecommendationHeader';
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getANZSICCodes, getFeatures } from "../redux/getters";
import DropdownSelect from './dropdown';
import TypeaheadSelect from './TypeaheadSelect';
import { Fragment } from 'react';
import LozengeButton from './LozengeButton';
import Slider, { Range } from 'rc-slider';

import 'rc-slider/assets/index.css';
import '../css/recommendation.css';

const RecommendationTool = (props) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [formState, setFormState] = useState({
        anzsic_code: "",
        customer_income: [0, 100],
        commercial_premises: 0,
        employee_count: 0
    });
    const { formData } = props;

    const features = useSelector(getFeatures)
    const rankFeatures = (features) => {
        // Get actual dollar amounts from customer_income question
        const incomeOptions = questionForKey('customer_income').values
        const customerIncome = {
            min: incomeOptions[formState.customer_income[0]],
            max: incomeOptions[formState.customer_income[1]],
        }

        // Get actual dollar amount from commercial_premises question
        const commercialOptions = questionForKey('commercial_premises').values
        const commercialRent = commercialOptions[formState.commercial_premises]

        // Filter and rank features
        // Get the actual ANZSIC codes matching this answer
        const codes = anzsicCodesForAnswer(formState.anzsic_code)
        const rankedFeatures = features.reduce((result, feature) => {
            let score = 0
            // Score feature.properties.mean_aud compared to desired
            // customer_income range.
            //
            // Note: This doesn't take into account mobility or financial
            //       bridges, so it only considers the income of people living
            //       in the given feature and not all potential customers.
            const meanIncome = feature.properties.mean_aud
            // Promote features with a mean income within the desired range
            if (meanIncome !== null) {
                // In the data, mean_aud never goes above ~$84,000, so this
                // code ignores the fact that 250,000 is supposed to mean
                // "250,000 or more".
                if (customerIncome.min <= meanIncome && meanIncome <= customerIncome.max) {
                    score += 1
                // Demote features further than one step outside of the desired
                // range
                } else if (customerIncome.min - 25_000 > meanIncome ||
                           customerIncome.max + 25_000 < meanIncome) {
                    score -= 1
                }
                // And leave the score untouched for features within one step but
                // not inside of the desired range
            }

            // Get a list of all keys for answer-relevant "Business Rental"
            // values, e.g. 'bsns_rent_42'
            //
            // Treat a lack of rent data as infinity dollars to penalize those
            // features when sorting.
            let meanRent = Infinity
            if (codes && codes.length > 0) {
                const keys = Object.keys(feature.properties)
                    .filter(key => key.startsWith('bsns_rent_') && codes.some(code => key.endsWith(`_${code}`)))
                // Score each feature based on how close its mean business rents
                // fit within the user's requested range.
                //
                // For features with multiple matching 'bsns_rent_*' properties,
                // average their scores together.
                //
                // Note: This is an unintelligent search, searching the entire
                //       ANZSIC division regardless of how specific the user's
                //       ANZSIC choice was. The underlying data is spotty, so not
                //       all subdivisions are represented in the data. At least
                //       half of all ANZSIC codes are missing, meaning a simpler
                //       but more accurate mechanism here would result in half of
                //       the possible business types being unscorable.
                meanRent = keys.reduce((result, key) => {
                    return result + Number(feature.properties[key])
                }, 0.0) / keys.length
                // Promote a feature if the average rent of businesses in that
                // ANZSIC division in the feature is within the desired range.
                // Demote a feature if the value is outside of the desired
                // range.
                // Leave it alone if there's no relevant data for this feature.
                if (!isNaN(meanRent)) {
                    if (meanRent <= commercialRent) {
                        score += 1
                    } else if (meanRent > commercialRent) {
                        score -= 1
                    }
                } else {
                    // Penalize features with no rent data when sorting
                    meanRent = Infinity
                }
            }

            // Save out score, sort by score and then commercial rent cost,
            // and return the top 4 results.
            result.push({ score, feature, meanRent })
            return result
        }, []).sort((a, b) => a.meanRent - b.meanRent).sort((a, b) => b.score - a.score)
        return rankedFeatures.slice(0, 4).map(f => f.feature)
    }

    // Find the question in formData with the given key
    const questionForKey = (key) => {
        for (const stage of formData) {
            const question = stage.questions.find(
                (question) => question.key === key)
            if (question) {
                return question
            }
        }
        return null
    }

    const anzsicCodesForAnswer = (answer) => {
        if (!answer) {
            return null
        }
        // Find all matching needles in this haystack.
        // If needle is a class, one entry is returned. If it's less specific,
        // multiple entries will be returned.
        const needle = answer.split(":")[0]
        const divisionCode = anzsicCodes.find((code) => [
            code.division_code,
            code.subdivision_code,
            code.group_code,
            code.class_code].includes(needle)).division_code

        // The business rental data is only at the subdivision level and
        // lower. If the user selected a division, find all subdivisions in
        // that division and then consider all of them for rankings.

        // Compile list of subdivisions, groups, and classes to search for
        // i.e. all 2, 3, and 4 digit codes under this division
        return [...anzsicCodes.reduce((result, code) => {
            if (code.division_code === divisionCode) {
                result.add(code.subdivision_code)
                result.add(code.group_code)
                result.add(code.class_code)
            }
            return result
        }, new Set())]
    }

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
            if (!uniqueSubdivisionCodes.has(code.subdivision_code)) {
                result.push(`${code.subdivision_code}: ${code.subdivision_title}`)
                uniqueSubdivisionCodes.add(code.subdivision_code)
            }
            // Create a new group-level entry if needed
            if (!uniqueGroupCodes.has(code.group_code)) {
                result.push(`${code.group_code}: ${code.group_title}`)
                uniqueGroupCodes.add(code.group_code)
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

    const setANZSICAnswer = (key, answer) => {
        setFormState({...formState, [key]: answer})
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
            case "slider_single":
                return <>{
                    <Slider
                        // Each mark is a step.
                        step={null}
                        // Must be in the form { 0: "Foo" }, where 0 is where
                        // the mark should appear on the slider from 0 to 100.
                        marks={question.answers}
                        defaultValue={formState[question.key] ?? 0}
                        onAfterChange={(value) => {setSliderValue(question.key, value)}}
                    />
                }
                </>
            case "slider_range":
                return <>{
                    <Range
                        // Each mark is a step.
                        step={null}
                        // Must be in the form { 0: "Foo" }, where 0 is where
                        // the mark should appear on the slider from 0 to 100.
                        marks={question.answers}
                        defaultValue={formState[question.key] ?? [0, 100]}
                        onAfterChange={(value) => {setSliderValue(question.key, value)}}
                    />
                }
                </>
            case "typeahead_select":
                return <TypeaheadSelect
                    items={(question.key === "anzsic_code") ? anzsicAnswers : question.answers}
                    initialSelectedItem={formState[question.key] ?? null}
                    placeholder="Search by business category or ANZSIC code"
                    handleSelectionChanged={value => {setANZSICAnswer(question.key, value)}}
                    />
            default:
                return <></>
        }
    }
    

    return <>
        <RecommendationHeader currentStage={currentStage} stages={[...formData.map(x => x.title), "Results"]}/>
        <div className="stage">
            {currentStage < formData.length ?
                <>
                    {!formData[currentStage].description ?
                        <></> :
                        <p className="stageDescription">{formData[currentStage].description}</p>
                    }
                    <div className="questionList">
                        {currentStage === formData.length ?
                            <></> :
                            formData[currentStage].questions.map((question, idx) => {
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
                        { rankFeatures(features).map(feature => 
                            <li key={feature.properties.SA2_MAIN16}>{feature.properties.SA2_NAME16}</li>
                        )}
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
            {currentStage !== formData.length &&
                <LozengeButton
                    buttonType="prominent"
                    buttonSize="medium"
                    onClick={() => {setCurrentStage(currentStage + 1)}}
                    text="Next"
                />
            }
            {currentStage === formData.length &&
                <LozengeButton
                    buttonType="prominent"
                    buttonSize="medium"
                    showChevron={true}
                    url={`/comparison/${rankFeatures(features).map(f => f.properties.SA2_MAIN16).join('+')}`}
                    text="Compare Locations"
                />
            }
        </div>
    </>
};

RecommendationTool.propTypes = {
    formData: PropTypes.array.isRequired
}

export default RecommendationTool;