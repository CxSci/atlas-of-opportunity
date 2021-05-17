import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Collapsible from "react-collapsible";
import propsMapping from "./propsMapping";
import { updateCollapsibleState } from "../redux/action-creators";

const sections = [['Locations to Compare', true], ...propsMapping.map(x => ([x.title, true]))];
const initialOpen = Object.fromEntries(sections);

const LocationDetails = (props) => {
  const featureProps = props.feature.properties;
  const comparisonFts = props.comparison;
  const isOpen = props.collapsibleState || initialOpen;
  
  React.useEffect(() => {
    if (!props.collapsibleState) {
      updateCollapsibleState(initialOpen);
    }
  }, [props.collapsibleState])

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
  const compTitle = 'Locations to Compare';

  return (
    <div
      style={{ overflowY: "auto" }}
      className={`sidebar-content`}
    >
      {comparisonFts.length > 0 && 
        <Collapsible trigger={compTitle} open={isOpen[compTitle]} onOpen={() => onOpen(compTitle)} onClose={() => onClose(compTitle)}>
          {props.children}
        </Collapsible>
      }
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
    id: PropTypes.number,
    properties: PropTypes.any
  }),
  comparison: PropTypes.array,
  collapsibleState: PropTypes.object,
  children: PropTypes.node
}

export default LocationDetails;
