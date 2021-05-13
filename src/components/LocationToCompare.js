import React from "react";
import { useSelector } from "react-redux";
import { getComparisonFeatures } from "../redux/getters";
import { ReactComponent as CloseIcon } from "../assets/close_icon.svg";
import { removeComparisonFeature } from "../redux/action-creators";
import ComparisonButton from "./ComparisonButton";
import { useHistory } from "react-router";
import PropTypes from "prop-types";

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

const listRoot = {
    marginRight: "-9px"
}

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

const LocationCompare = ({showButton}) => {
  const comparisonFeatures = useSelector(getComparisonFeatures);
  const history = useHistory();

  return (
    <div style={root}>
    <div style={listRoot}>
      {comparisonFeatures.map((feature) => {
        return (
          <div style={featureRoot} key={feature.properties.SA2_MAIN16}>
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
      </div>
      {showButton && (
        <>
          <ComparisonButton onClick={() => { history.push('/comparison') }} />
          <div>
            <p style={disclaimerText}>Add up to 4 regions.</p>
          </div>
        </>
      )}
    </div>
  );
};

LocationCompare.propTypes = {
  showButton: PropTypes.bool
}

export default LocationCompare;
