import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import * as Constants from "../constants";
import { setMapType } from "../redux/action-creators";

let Legend = class Legend extends React.Component {
  static propTypes = {
    active: PropTypes.object.isRequired,
    mapType: PropTypes.string.isRequired,
  };

  render() {
    const { description, stops } = this.props.active;

    const mapType = [
      {
        key: Constants.MAP_TYPE.GROWTH,
        value: Constants.MAP_TYPE.GROWTH,
        text: "Mobility Map",
      },
      {
        key: Constants.MAP_TYPE.SEGREGATION,
        value: Constants.MAP_TYPE.SEGREGATION,
        text: "Economic Segregation",
      },
      {
        key: Constants.MAP_TYPE.TRANSACTIONS,
        value: Constants.MAP_TYPE.TRANSACTIONS,
        text: "Financial Interactions",
      },
    ];

    const renderLegendKeys = (stops) => {
      return (
        <div className="txt-m">
          <span
            className="h24 inline-block align-middle"
            style={{
              background: `linear-gradient(90deg, ${stops.map(
                (stop) => stop[1]
              )})`,
              width: "196px",
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
              <p key={i}> {stop[0].toLocaleString()} </p>
            ))}
          </div>
        </div>
      );
    };

    const mapTypeEvent = (e, { value }) => {
      setMapType(value);
    };

    let legendName = this.props.active.legendName;
    return (
      <div className="bg-white absolute bottom left ml24 mb36 py12 px12 shadow-darken10 round z1 wmax220">
        <div className="mt6 mb12">
          <Dropdown
            defaultValue={mapType[0].value}
            selection
            options={mapType}
            onChange={mapTypeEvent}
          />
        </div>
        <div className="mb6">
          <h2 className="txt-bold txt-m block">{legendName}</h2>
          <p className="txt-s color-gray">{description}</p>
        </div>
        {renderLegendKeys(stops)}
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    active: state.active,
    mapType: state.mapType,
  };
}

Legend = connect(mapStateToProps)(Legend);

export default Legend;
