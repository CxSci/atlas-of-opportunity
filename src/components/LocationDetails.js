import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import propsMapping from "./propsMapping";
import CollapsibleSection from "./CollapsibleSection";
import { formatValue } from "../utils/formatValue";

const LocationDetails = (props) => {
  const featureProps = props.feature.properties;
  const comparisonFts = props.comparison;
  const allFeatures = [...comparisonFts, props.feature].filter((val, idx, arr) => arr.indexOf(val) === idx);

  const renderMetric = (metric) => {
    let rawValue = featureProps[metric.id];
    const value = formatValue(rawValue, metric.format);

    return (
      <div key={metric.id}>
        <h2 data-tip data-for={metric.id}>{metric.label}</h2>
        {metric.desc && (
          <ReactTooltip id={metric.id}>
            <strong>{metric.label}</strong>
            <div style={{maxWidth: 400}}>
              {metric.desc}
            </div>
          </ReactTooltip>
        )}
        {comparisonFts.length ? (
          allFeatures.map(ft => 
            renderValue(ft, metric)
          )
        ) : (
          <p>{value}</p>
        )}
      </div>
    )
  }

  const renderValue = (feature, metric) => {
    let rawValue = feature.properties[metric.id];
    const value = formatValue(rawValue, metric.format);
    
    return (
      <p key={feature.id} className="comparison">
        <span>{feature.properties.SA2_NAME16}</span>
        <span>{value}</span>
      </p>
    )
  }

  return (
    <div
      style={{ overflowY: "auto" }}
      className={`sidebar-content`}
    >
      {props.children}
      {propsMapping.map((section) => (
        <CollapsibleSection title={section.title} key={section.title}>
          {section.content.map((metric) => (
            renderMetric(metric)
          ))}
        </CollapsibleSection>
      ))}
    </div>
  )
}

LocationDetails.propTypes = {
  feature: PropTypes.shape({
    properties: PropTypes.any
  }),
  comparison: PropTypes.array,
  children: PropTypes.node
}

export default LocationDetails;
