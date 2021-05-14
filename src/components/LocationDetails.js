import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Collapsible from "react-collapsible";
import propsMapping from "./propsMapping";
import { updateCollapsibleState } from "../redux/action-creators";

const initialOpen = Object.fromEntries(propsMapping.map(x => ([x.title, true])));

const LocationDetails = (props) => {
  const featureProps = props.feature.properties;
  const isOpen = props.collapsibleState || initialOpen;

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

  const onOpen = (key) => updateIsOpen(key, true);
  const onClose = (key) => updateIsOpen(key, false);

  const updateIsOpen = (key, value) => {
    const newValue = {...isOpen, [key]: value};
    updateCollapsibleState(newValue);
  }

  return (
    <div
      style={{ overflowY: "auto" }}
      className={`sidebar-content`}
    >
      {props.children}
      {propsMapping.map((section) => (
        <Collapsible trigger={section.title} key={section.title} open={isOpen[section.title]} onOpen={() => onOpen(section.title)} onClose={() => onClose(section.title)}>
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
  collapsibleState: PropTypes.object,
  children: PropTypes.node
}

export default LocationDetails;
