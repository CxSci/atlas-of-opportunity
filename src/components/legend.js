import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setMapType } from "../redux/action-creators";
import DropdownSelect from "./dropdown.js"
import { BarChart, Bar, XAxis, YAxis, ReferenceArea, Label } from 'recharts';

import "../css/legend.css";

function Legend({ activeLayer, mapLayers, absolute = false }) {
  const { name, description, stops } = activeLayer;

  const mapTypeEvent = (value) => {
    const mapType = Object.keys(mapLayers).find(t => mapLayers[t].name === value)
    setMapType(mapType);
  };

  return (
    <div className={`legend`} style={{position: absolute ? "absolute" : undefined}}>
      <div className="mt6 mb12">
        <DropdownSelect
          items={Object.keys(mapLayers).map(t => mapLayers[t].name)}
          selectedItem={name}
          handleSelectionChanged={mapTypeEvent}
        />
      </div>
      {description && <div className="mb6">
        <p className="txt-s color-gray">{description}{JSON.stringify(stops)}</p>
      </div>}
      {renderGradientBar({width: 276, height: 30, max: 1.2})}
    </div>
  )
}

const renderGradientBar = ({ width, height, min = 0, max = 1 }) => {
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
      <XAxis type="number" domain={[0, max]} hide />
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
  const minColor = 'rgb(255,233,0)';
  const maxColor = 'rgb(242,11,11)';
  const lineX = width / 2;

  return (
    <svg x={x} y={y}>
      <defs>
        <linearGradient id={`legend-gradient`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: minColor }} />
          <stop offset="100%" style={{ stopColor: maxColor }} />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill={`url(#legend-gradient)`} />
      <line x1={lineX} y1={0} x2={lineX} y2={height} stroke="white" strokeDasharray="1 1"/>
    </svg>
  );
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
