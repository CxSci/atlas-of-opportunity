import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as Constants from "../constants";
import { setMapType } from "../redux/action-creators";
import DropdownSelect from "./dropdown.js"

import "../css/legend.css";

const mapTypes = [
  {
    value: Constants.MAP_TYPE.GROWTH,
    text: "Mobility - GDP Growth Potential",
  },
  {
    value: Constants.MAP_TYPE.SEGREGATION,
    text: "Economic Segregation - Inequality Index",
  },
  {
    value: Constants.MAP_TYPE.TRANSACTIONS,
    text: "Financial Interactions - Growth Potential",
  },
];

const mapTypeEvent = (value) => {
  const mapType = mapTypes.find((t) => t.text === value)
  setMapType(mapType.value);
};

const renderLegendKeys = (stops) => (
  <div className="txt-m">
    <span
      className="h24 inline-block align-middle"
      style={{
        background: `linear-gradient(90deg, ${stops.map(
          (stop) => stop[1]
        )})`,
        width: "100%",
        borderRadius: "2px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {stops.map((stop, i) => {
          if (i !== 0 && i !== stops.length - 1) {
            return (
              <span
                key={i}
                style={{
                  borderLeft: "2px solid white",
                  height: "24px",
                  borderStyle: "dotted",
                }}
              />
            );
          } else {
            return (
              <span
                key={i}
                style={{
                  borderLeft: "2px solid transparent",
                  height: "24px",
                }}
              />
            );
          }
        })}
      </div>
    </span>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {stops.map((stop, i) => (
        <span key={i}> {stop[0].toLocaleString()} </span>
      ))}
    </div>
  </div>
);

function Legend({ active, absolute }) {
  const { description, stops } = active;

  return (
    <div className={`legend`} style={{position: absolute ? "absolute" : undefined}}>
      <div className="mt6 mb12">
        <DropdownSelect
          items={mapTypes.map((t) => t.text)}
          initialSelectedItem={mapTypes[0].text}
          handleSelectionChanged={mapTypeEvent}
        />
      </div>
      <div className="mb6">
        <p className="txt-s color-gray">{description}</p>
      </div>
      {renderLegendKeys(stops)}
    </div>
  )
}

Legend.propTypes = {
  active: PropTypes.object.isRequired,
  absolute: PropTypes.bool
}

function mapStateToProps(state) {
  return {
    active: state.active,
  };
}

export default connect(mapStateToProps)(Legend);
