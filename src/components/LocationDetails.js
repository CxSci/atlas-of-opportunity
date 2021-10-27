import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";

import { getANZSICCodes } from "../redux/getters";
import propsMapping from "../config/propsMapping";
import CollapsibleSection from "./CollapsibleSection";
import { formatLabel, formatValue } from "../utils/formatValue";
import MetricDetails from "./MetricDetails";
import RangeBar from "./charts/RangeBar";
import SolidBar from "./charts/SolidBar";
import LineChartMetric from "./charts/LineChartMetric";
import generateMetrics from "../utils/generateMetrics";

import ViewportList from '../../node_modules/react-viewport-list';


import {useRef } from 'react';




const LocationDetails = (props) => {
  const selectedFeature = props.feature;
  const comparisonFts = props.comparison;
  const anzsicCodes = useSelector(getANZSICCodes);

  



  let allFeatures = comparisonFts;
  if (selectedFeature && !comparisonFts.find(feature => feature.properties["SA2_MAIN16"] === selectedFeature.properties["SA2_MAIN16"])) {
    allFeatures = [...allFeatures, props.feature]
  }


  const renderMetric = (metric) => {
    const label = formatLabel(metric, anzsicCodes)


    return (
      <div key={metric.id} className="metric">
        <h2 data-tip data-for={metric.id}>{label}</h2>
        {metric.desc && (
          <ReactTooltip id={metric.id}>
            <strong>{label}</strong>
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




 // Bulid the virtualizing list 
  const ItemsList = ({ items }) => {
    const ref = useRef(null);

    return (
        <div className="scroll-container" ref={ref}>
            <ViewportList
                viewportRef={ref}
                items={items}
                itemMinSize={40}
                margin={8}
            >
                {(item) => (
                  
                    <div key={item.key} className="item">
                        {item}
                    </div>
                )}
            </ViewportList>
        </div>
    );
};

ItemsList.propTypes = {
  items: PropTypes.any.isRequired
}

// store all the collapsible sections in the list for further virtualizing 
var Data = [];






  return (
    
    <>
    
      
      {props.children}
      {propsMapping.map((section) => {
        {/* Preprocess section.content to expand its generators */}
        const metrics = generateMetrics(section.content, allFeatures);

        for (var i=0;i<20;i++){
          const collapsible = (<CollapsibleSection title={section.title + i.toString()} key={section.title + i.toString()}>
            {metrics.length === 0 &&
              <div className="metric" style={{padding: '10px 0'}}>No Data</div>
            }
            {metrics.map(renderMetric)}
          </CollapsibleSection>);
          Data.push(collapsible);

        }





      }
      )}
      

      <ItemsList items={Data} />

      


      

    

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
