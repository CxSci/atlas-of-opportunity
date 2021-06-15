import React from "react";
import PropTypes from "prop-types";
import { formatValue } from "../utils/formatValue";
import RangeBar from "./charts/RangeBar";
import SolidBar from "./charts/SolidBar";
import LineChartMetric from "./charts/LineChartMetric";

const MetricDetails = ({ featureList, metric, small }) => {
  const width = small ? 240 : undefined;
  const data = featureList.map((feature) => JSON.parse(feature.properties['pop_proj']));
  
  const renderSingleMetic = (feature) => {
    let rawValue = feature.properties[metric.id];
    const value = formatValue(rawValue, metric.format);
    const name = feature.properties.SA2_NAME16;
    const width = small ? 115 : undefined;
    
    switch (metric.type) {
      case 'range':
        return (
          <div key={feature.properties.SA2_MAIN16} className="comparison-bar">
            <label title={name}>{name}</label>
            <RangeBar value={rawValue} min={metric.min} max={metric.max} width={width}/>
          </div>
        )
      case 'bar':
        return (
          <div key={feature.properties.SA2_MAIN16} className="comparison-bar">
            <label title={name} data-value={rawValue}>{name}</label>
            <SolidBar label={value} value={rawValue} max={metric.max} width={width} />
          </div>
        )
      default:
        return (
          <div key={feature.properties.SA2_MAIN16} className="comparison">
            <label title={name}>{name}</label>
            <data value={rawValue}>{value}</data>
          </div>
        )
    }
  }

  return (
    metric.type === 'line-chart'
      ? <LineChartMetric data={data} width={width} />
      : featureList.map(renderSingleMetic)
  )
}

MetricDetails.propTypes = {
  featureList: PropTypes.array,
  metric: PropTypes.any,
  small: PropTypes.bool,
};

export default MetricDetails;