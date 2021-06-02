import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";
import propsMapping from "./propsMapping";
import { formatValue } from "../utils/formatValue";
import "../css/GridView.css"

const GridView = ({comparisonFeatures}) => {
  const comparisonFts = comparisonFeatures;

  const renderTable = (section) => {
    return (
      <div className="grid-container">
        {section.content.map((metric) => (
          <div key={metric.id} className="grid-item">
            <div className="grid-item-head">
              <h2>{metric.label}</h2>
            </div>
            <div className="grid-item-body">
              {comparisonFts.map(ft => 
                renderValue(ft, metric)
              )}
            </div>
          </div>
        ))}
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
    <div className="grid-view">
      {propsMapping.map((section) => (
        <Collapsible trigger={section.title} key={section.title} open={true}>
          {renderTable(section)}
        </Collapsible>
      ))}
    </div>
  )
}

GridView.propTypes = {
  comparisonFeatures: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    comparisonFeatures: state.comparisonFeatures,
  };
}

export default connect(mapStateToProps)(GridView);