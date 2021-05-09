import React from 'react'
import { useSelector } from 'react-redux';
import { getComparisonFeatures } from '../redux/getters';
import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";
import { removeComparisonFeature } from '../redux/action-creators';

const root = {
    display: "flex",
    flexDirection: "column",
    width: "100%"
}

const featureRoot = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
}

const closeIcon = {
    cursor: "pointer"
}

const LocationCompare = () => {
    const comparisonFeatures = useSelector(getComparisonFeatures);
    return <div style={root}>
        {comparisonFeatures.map(feature => {
            console.log(feature)
            return <div style={featureRoot} key={feature.primary}>
                <div>
                    <p>{feature.primary || feature.properties["SA2_NAME16"]}</p>
                </div>
                <CloseIcon style={closeIcon} onClick={()=>{
                   removeComparisonFeature(feature)
                }}/>
            </div>
        })}
    </div>
}

export default LocationCompare;