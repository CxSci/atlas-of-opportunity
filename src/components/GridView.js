import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";
import propsMapping from "./propsMapping";
import { formatValue } from "../utils/formatValue";
import "../css/GridView.css"

const GridView = ({comparisonFeatures}) => {

  const renderTable = (section) => {
    const data = [];
    
    section.content.forEach((metric, idx) => {
      let columnValues = comparisonFeatures.map((ft, idx) => {
        let rawValue = ft.properties[metric.id];
        const value = formatValue(rawValue, metric.format);
        return ({ [`regionData${idx + 1}`]: value })
      });
      columnValues.push({regionName: metric.label});
      columnValues.push({id: idx});
      const row = columnValues.reduce((prev, curr) => ({...prev, ...curr}));
      data.push(row);
    })

    return (
      <div className="grid-container">
        {data.map(item => (
          <div key={item.id} className="grid-item">
            {item.regionName}
          </div>
        ))}
      </div>
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