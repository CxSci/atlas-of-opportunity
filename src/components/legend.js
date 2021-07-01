import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setMapType } from "../redux/action-creators";
import DropdownSelect from "./dropdown.js"
import { BarChart, Bar, XAxis, YAxis, ReferenceArea, Label } from 'recharts';

import "../css/legend.css";

const styles = {
  description: {
    fontSize: 12,
    marginLeft: 2,
    marginBottom: 8,
  }
}

function Legend({ activeLayer, mapLayers, absolute = false }) {
  const { name, description, stops } = activeLayer;

  const mapTypeEvent = (value) => {
    const mapType = Object.keys(mapLayers).find(t => mapLayers[t].name === value)
    setMapType(mapType);
  };

  const renderGradientBar = ({ width, height }) => {
    const min = stops[0][0];
    const max = stops[2][0];

    const data = [
      { name: "bar", value: max },  // the Bar itself
      { name: "empty", value: 0 },  // empty bar for ReferenceArea
    ];
    height = height * 2;
  
    return (
      <BarChart width={width}
        height={height}
        data={data}
        layout="vertical"
        margin={{ top: 0, left: 0, bottom: 0, right: 0, }}
      >
        <XAxis type="number" domain={[min, max]} hide />
        <YAxis type="category" dataKey="name" hide />
        <Bar dataKey="value" barSize={height} shape={renderShape} isAnimationActive={false} />
        <ReferenceArea x1={0} x2={max} y1={"empty"} fill="transparent">
          <Label value={min} position="insideLeft" fontSize={14} />
          <Label value={max / 2} position="center" fontSize={14} />
          <Label value={max} position="insideRight" fontSize={14} />
        </ReferenceArea>
      </BarChart>
    );
  }
  
  const renderShape = ({ height, width, x, y }) => {
    const lineX = width / 2;
    const colors = stops.map(x => x[1]);
  
    return (
      <svg x={x} y={y}>
        <defs>
          <linearGradient id={`legend-gradient`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: colors[0] }} />
            <stop offset="50%" style={{ stopColor: colors[1] }} />
            <stop offset="100%" style={{ stopColor: colors[2] }} />
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill={`url(#legend-gradient)`} />
        <line x1={lineX} y1={0} x2={lineX} y2={height} stroke="white" strokeDasharray="1 1"/>
      </svg>
    );
  }

  return (
    <div className={`legend`} style={{position: absolute ? "absolute" : undefined}}>
      <div className="mt6 mb12">
        <DropdownSelect
          items={Object.keys(mapLayers).map(t => mapLayers[t].name)}
          selectedItem={name}
          handleSelectionChanged={mapTypeEvent}
        />
      </div>
      {description && 
        <p style={styles.description}>{description}</p>
      }
      {(stops && stops.length > 0) && renderGradientBar({width: 276, height: 30})}
    </div>
  )
}

Legend.propTypes = {
  activeLayer: PropTypes.object.isRequired,
  mapLayers: PropTypes.object.isRequired,
  absolute: PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeLayer: state.activeLayer,
    mapLayers: state.mapLayers,
  };
}

export default connect(mapStateToProps)(Legend);
