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
    console.log("active:", this.props.active);

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

    const renderLegendKeys = (stop, i) => {
      return (
        <div key={i} className="txt-m">
          <span
            className="mr6 round-full w12 h12 inline-block align-middle"
            style={{ backgroundColor: stop[1] }}
          />
          <span>{`${stop[0].toLocaleString()}`}</span>
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
            search
            selection
            options={mapType}
            onChange={mapTypeEvent}
          />
        </div>
        <div className="mb6">
          <h2 className="txt-bold txt-m block">{legendName}</h2>
          <p className="txt-s color-gray">{description}</p>
        </div>
        {stops.map(renderLegendKeys)}
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
