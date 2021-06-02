import React from "react";
import PropTypes from "prop-types";
import { formatValue } from "../utils/formatValue";

const MetricDetails = ({ feature, metric }) => {
  let rawValue = feature.properties[metric.id];
  const value = formatValue(rawValue, metric.format);
  
  return (
    <p key={feature.id} className="comparison">
      <span>{feature.properties.SA2_NAME16}</span>
      <span>{value}</span>
    </p>
  )
}

MetricDetails.propTypes = {
  feature: PropTypes.any,
  metric: PropTypes.any,
};

export default MetricDetails;