import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import propsMapping from "./propsMapping";
import CollapsibleSection from "./CollapsibleSection";
import { formatValue } from "../utils/formatValue";

const LocationDetails = (props) => {
  const selectedFeature = props.feature;
  const comparisonFts = props.comparison;
  let allFeatures = comparisonFts;
  if (selectedFeature && !comparisonFts.find(feature => feature.properties["SA2_MAIN16"] === selectedFeature.properties["SA2_MAIN16"])) {
    allFeatures = [...allFeatures, props.feature]
  }

  const renderMetric = (metric) => {
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
          renderStackedFeatures(allFeatures, metric)
        ) : (
          formatMetric(selectedFeature, metric)
        )}
      </div>
    )
  }

  const renderStackedFeatures = (features, metric) => {
    return (
      features.map(feature => 
        <p key={feature.properties.SA2_MAIN16} className="comparison">
          <span>{feature.properties.SA2_NAME16}</span>
          <span>{formatMetric(feature, metric)}</span>
        </p>
      )
    )
  }

  const formatMetric = (feature, metric) => {
    const rawValue = feature.properties[metric.id];
    return formatValue(rawValue, metric.format);
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
