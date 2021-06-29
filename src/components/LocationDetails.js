import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import propsMapping from "../config/propsMapping";
import CollapsibleSection from "./CollapsibleSection";
import { formatValue } from "../utils/formatValue";
import MetricDetails from "./MetricDetails";
import RangeBar from "./charts/RangeBar";
import SolidBar from "./charts/SolidBar";
import LineChartMetric from "./charts/LineChartMetric";

const LocationDetails = (props) => {
  const selectedFeature = props.feature;
  const comparisonFts = props.comparison;
  let allFeatures = comparisonFts;
  if (selectedFeature && !comparisonFts.find(feature => feature.properties["SA2_MAIN16"] === selectedFeature.properties["SA2_MAIN16"])) {
    allFeatures = [...allFeatures, props.feature]
  }

  // Add some metrics programmatically by calling their generator
  // e.g. some metrics are mostly repetitions except for their business
  // category.
  const generateMetrics = (contents) => {
    return contents.reduce((results, metric) => {
      if (!metric.generator) {
        results.push(metric)
      } else {
        results.push(...metric.generator(comparisonFts.length ? allFeatures : selectedFeature))
      }
      return results
    }, [])
  }

  const renderMetric = (metric) => {
    return (
      <div key={metric.id} className="metric">
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
          <MetricDetails featureList={allFeatures} metric={metric} />
        ) : (
          renderSelectedValue(metric)
        )}
      </div>
    )
  }
  
  const renderSelectedValue = (metric) => {
    let rawValue = selectedFeature.properties[metric.id];
    if (rawValue === undefined || rawValue === null) {
      return <div className="inline">n/a</div>;
    }
    const value = formatValue(rawValue, metric.format);
    
    switch (metric.type) {
      case 'line-chart': {
        return <LineChartMetric data={rawValue} width={260} />
      }
      case 'range':
        return <RangeBar value={rawValue} min={metric.min} max={metric.max} options={metric.options} width={260} />
      case 'bar':
        return <SolidBar label={value} value={rawValue} max={metric.max} width={260} />
      default:
        return <div className="inline">{value}</div>
    }
  }

  return (
    <>
      {props.children}
      {propsMapping.map((section) => (
        <CollapsibleSection title={section.title} key={section.title}>
          {/* Preprocess section.content to expand its generators */}
          {generateMetrics(section.content).map((metric) => (
            renderMetric(metric)
          ))}
        </CollapsibleSection>
      ))}
    </>
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
