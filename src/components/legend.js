import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

let Legend = class Legend extends React.Component {
  static propTypes = {
    active: PropTypes.object.isRequired,
    mapType: PropTypes.string.isRequired,
  };

  render() {
    const { description, stops } = this.props.active;
    console.log("active:", this.props.active);
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

    let legendName = this.props.active.legendName;
    return (
       <div className="bg-white absolute bottom right mr36 mb36 py12 px12 shadow-darken10 round z1 wmax180">
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
