import React from "react";
import { useSelector } from "react-redux";
import { getComparisonFeatures } from "../redux/getters";
import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";
import { removeComparisonFeature } from "../redux/action-creators";
import ComparisonButton from "./ComparisonButton";

const root = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100%",
};

const featureRoot = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 15,
};

const closeIcon = {
  cursor: "pointer",
};

const disclaimerText = {
  fontSize: "14px",
  fontWeight: "400",
  textAlign: "center",
  color: "#666666",
  marginTop: 10,
};

const LocationCompare = () => {
  const comparisonFeatures = useSelector(getComparisonFeatures);
  return (
    <div style={root}>
      {comparisonFeatures.map((feature) => {
        return (
          <div style={featureRoot} key={feature.primary}>
            <div>{feature.primary || feature.properties["SA2_NAME16"]}</div>
            <CloseIcon
              style={closeIcon}
              onClick={() => {
                removeComparisonFeature(feature);
              }}
            />
          </div>
        );
      })}
      <ComparisonButton onClick={() => {}} />
      <div>
        <p style={disclaimerText}>Add up to 4 regions.</p>
      </div>
    </div>
  );
};

export default LocationCompare;
