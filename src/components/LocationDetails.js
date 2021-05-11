import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Collapsible from "react-collapsible";
import propsMapping from "./propsMapping";

function LocationDetails(props) {
  const featureProps = props.feature.properties;

  const renderMetric = (metric) => {
    let value = featureProps[metric.id];
    switch (metric.format) {
      case 'number':
        if (value > 100) {
          value = Math.floor(value)
          value = value.toLocaleString('en-US');
        }
        else {
          value = Math.floor(value * 10000) / 10000;
          value = value.toLocaleString('en-US', { minimumFractionDigits: 4 });
        }
        break;
      case 'currency':
        value = value.toLocaleString(undefined, { style: "currency", currency: "AUS" });
        break;
      case 'percent':
        value = `${Math.floor(value)}%`;
        break;
      default:
        break;
    }

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
        <p>{value}</p>
      </div>
    )
  }

  return (
    <div
      style={{ overflowY: "auto" }}
      className={`sidebar-content`}
    >
      {props.children}
      {propsMapping.map((section) => (
        <Collapsible trigger={section.title} key={section.title}>
          {section.content.map((metric) => (
            renderMetric(metric)
          ))}
        </Collapsible>
      ))}
    </div>
  )
}

LocationDetails.propTypes = {
  feature: PropTypes.shape({
    properties: PropTypes.any
  }),
  children: PropTypes.node
}

export default LocationDetails;
