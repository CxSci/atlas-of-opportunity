import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CollapsibleSection from "./CollapsibleSection";
import { useSelector } from "react-redux";

import { getANZSICCodes } from "../redux/getters";
import { formatLabel } from "../utils/formatValue";
import propsMapping from "../config/propsMapping";
import MetricDetails from "./MetricDetails";
import generateMetrics from "../utils/generateMetrics";
import "../css/GridView.css"

const GridView = ({comparisonFeatures}) => {
  const anzsicCodes = useSelector(getANZSICCodes);

  const renderGrid = (section) => {
    const metrics = generateMetrics(section.content, comparisonFeatures);
  
    return (
      <div className="grid-container">
        {metrics.length === 0 &&
          <div className="grid-item metric" style={{padding: 10}}>
            No Data
          </div>
        }
        {metrics.map((metric) => (
          <div key={metric.id} className="grid-item metric">
            <div className="grid-item-head">
              <h2>{formatLabel(metric, anzsicCodes)}</h2>
            </div>
            <div className="grid-item-body">
              <MetricDetails featureList={comparisonFeatures} metric={metric} small />
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="grid-view">
      {propsMapping.map((section) => (
        <CollapsibleSection title={section.title} key={section.title}>
          {renderGrid(section)}
        </CollapsibleSection>
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