import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setMapType } from "../redux/action-creators";
import DropdownSelect from "./dropdown.js"

import "../css/legend.css";

const renderLegendKeys = (stops) => {

  return !stops || stops.length === 0 ? <></> : (
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
);}

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
          initialSelectedItem={name}
          handleSelectionChanged={mapTypeEvent}
        />
      </div>
      {description && <div className="mb6">
        <p className="txt-s color-gray">{description}</p>
      </div>}
      {renderLegendKeys(stops)}
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
