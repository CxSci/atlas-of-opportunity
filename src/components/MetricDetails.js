import React from "react";
import PropTypes from "prop-types";
import { formatValue } from "../utils/formatValue";
import GradientBar from "./charts/GradientBar";

const MetricDetails = ({ feature, metric }) => {
  let rawValue = feature.properties[metric.id];
  const value = formatValue(rawValue, metric.format);
  const name = feature.properties.SA2_NAME16;

  switch (metric.type) {
    case 'hilo-bar':
      return (
        <div key={feature.properties.SA2_MAIN16} className="comparison-bar">
          <label title={name}>{name}</label>
          <GradientBar value={rawValue} />
        </div>
      )
    default:
      return (
        <p key={feature.properties.SA2_MAIN16} className="comparison">
          <label title={name}>{name}</label>
          <data value={rawValue}>{value}</data>
        </p>
      )
  }
}

MetricDetails.propTypes = {
  feature: PropTypes.any,
  metric: PropTypes.any,
};

export default MetricDetails;