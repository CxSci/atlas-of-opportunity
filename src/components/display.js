import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from 'react-tooltip';
import { Link} from 'react-router-dom';


import * as Constants from "../constants";
import { setFlowDirection, setDisplayDefault } from "../redux/action-creators";
import BarGraph from "./BarGraph";
import { Divider } from "semantic-ui-react";

let Display = class Display extends React.Component {
  static propTypes = {
    active: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    mapType: PropTypes.string.isRequired, // one of { growth,segregation}
    flowDirection: PropTypes.string.isRequired,
  };

  onFlowChange = (e) => {
    let direction = e.target.value;
    this.flowDirection = direction;
    setFlowDirection(direction);
  };

  componentDidUpdate(prevProps) {
    // return display to default settings if we've changed map types
    if (this.props.mapType !== prevProps.mapType) {
      setDisplayDefault();
    }
  }
  PanelContainer = (props) => (
    <div className="flex-parent flex-parent--column flex-parent--space-between-main absolute top right w240 h-full pt60 pb36 mr12 z2">
      {props.children}
    </div>
  );

  renderGrowthDisplay() {
    const {
      sa2_name,
      population,
      income,
      ggp,
      jr,
      bgi,
      sa1_codes,
    } = this.props.select;
    const { flowDirection, mapType } = this.props;
    const TopPanel = () => (
      <div
        style={{ overflowY: "auto" }}
        className="bg-white flex-child flex-child--grow mt30 mb24 shadow-darken10 w240"
      >
        <div className="py12 px12">
          <div className="">
            <h2 className="txt-bold txt-l txt-uppercase block">{sa2_name}</h2>
          </div>
        </div>
        <div className="py12 px12">
          <div className="mb6">
            <h3>
              {mapType === "growth"
                ? "Pattern of Mobility"
                : "Pattern of Spending"}
            </h3>
          </div>
        </div>
        <div className="py12 px12 bg-orange-faint">
          <div className="mb6">
            <h2 className="txt-bold txt-m color-orange block">Population</h2>
            <p className="txt-s">{population}</p>
          </div>
          <div className="mb6">
            <h2 className="txt-bold txt-m color-orange block">Median Income</h2>
            <p className="txt-s">{income}</p>
          </div>
        </div>
        <div className="py12 px12">
          <div className="mb6">
            <h2 className="txt-bold txt-m block" data-tip data-for = "GDPTip">GDP Growth Potential
            {/* <Link  to = '/Research' style = {{ whiteSpace: "pre" }}>{`${'                      '}`} ? </Link>  */}
            </h2>
            <ReactTooltip id = "GDPTip" > 
            <b> GDP Growth Potential </b> <br />
            Economic growth is an increase in the production <br />of 
             economic goods and services,compared from <br /> one period of  
             time to another...Traditionally, aggregate <br /> 
             economic growth is measured in terms of gross national <br /> 
            product (GNP) or gross domestic product (GDP), although
            <br />  alternative metrics are sometimes used.
            </ReactTooltip>

          <p className="txt-s">{ggp}</p>
          </div>
          <div className="mb6">
          <h2 className="txt-bold txt-m block" data-tip data-for = "jobTip">Job Resilience
            {/* <Link  to = '/Research' style = {{ whiteSpace: "pre" }}>{`${'                               '}`} ? </Link>  */}
            </h2>  
            <ReactTooltip id = "jobTip" > 
            <b> Job Resilience </b> <br />The ability to adjust to career change as it happens <br />
            and,by extension, adapt to what the market demands. 
            </ReactTooltip>
            <p className="txt-s">{jr}</p>
          </div>
          <div className="mb6">
          <h2 data-tip className="txt-bold txt-m block" data-for = "bgiTip">
              Business Growth Index 
              {/* <Link  to = '/Research' style = {{ whiteSpace: "pre" }}>{`${'          '}`} ? </Link>  */}
            </h2>
            <ReactTooltip id = "bgiTip" > 
            <b> Business Growth Index </b> <br />
          The growth rate is the measure of a company’s increase <br />
          in revenue and potential to expand over a set period.
            </ReactTooltip>            <p className="txt-s">{bgi}</p>
          </div>
          <div className="mb6">
            <h2 className="txt-bold txt-m block" data-tip data-for = "SATip"> Included SA1 Regions</h2>
            <p className="txt-s">{sa1_codes}</p>
          </div>
        </div>
      </div>
    );

    const BottomPanel = () => (
      <div className="bg-white flex-child flex-child--no-shrink shadow-darken10 w240">
        <div id="options" className="pb12 px12 bg-orange-faint">
          <form>
            <p className="pt6 txt-m txt-bold">Change flow direction</p>
            <div>
              <label className="p12 txt-s block">
                <input
                  type="radio"
                  name="flow"
                  value={Constants.FLOW_OUT}
                  checked={flowDirection === Constants.FLOW_OUT}
                  onChange={this.onFlowChange}
                />
                &nbsp;Outflow
              </label>
            </div>
            <div>
              <label className="p12 txt-s block">
                <input
                  type="radio"
                  name="flow"
                  value={Constants.FLOW_IN}
                  checked={flowDirection === Constants.FLOW_IN}
                  onChange={this.onFlowChange}
                />
                &nbsp;Inflow
              </label>
            </div>
            <div>
              <label className="p12 txt-s block">
                <input
                  type="radio"
                  name="flow"
                  value={Constants.FLOW_BI}
                  checked={flowDirection === Constants.FLOW_BI}
                  onChange={this.onFlowChange}
                  />
                &nbsp;Bi-directional
              </label>
            </div>
          </form>
        </div >
        {/* <div className="py12 px12">
          <p className="txt-s">
            Select a community to learn more about opportunity in that area.
          </p>
        </div> */}
      </div>
    );
    return (
      <this.PanelContainer>
        <TopPanel />
        <BottomPanel />
      </this.PanelContainer>
    );
  }

  renderSegregationDisplay() {
    const {
      sa2_name,
      population,
      income,
      quartile,
      inequality,
      ggp,
      jr,
      bgi,
      sa1_codes,
    } = this.props.select;
    return (
      <this.PanelContainer>
        <div
          style={{ overflowY: "auto" }}
          className="bg-white flex-child flex-child--grow mt30 mb24 shadow-darken10 w240"
        >
          <div className="py12 px12">
            <div className="">
              <h2 className="txt-bold txt-l txt-uppercase block">{sa2_name}</h2>
            </div>
          </div>
          <div className="py12 px12">
            <div className="mb6">
              <h3>Economic Inequality</h3>
            </div>
          </div>
          <div className="py12 px12 bg-orange-faint">
            <div className="mb6">
              <h2 className="txt-bold txt-m color-orange block">Population</h2>
              <p className="txt-s">{population}</p>
            </div>
            <div className="mb6">
              <h2 className="txt-bold txt-m color-orange block">
                Median Income
              </h2>
              <p className="txt-s">{income}</p>
            </div>
            <div className="mb6">
              <h2 className="txt-bold txt-m color-orange block">
                Income Quartile
              </h2>
              <p className="txt=s">{quartile}</p>
            </div>
            <div className="mb6">
              <h2 className="txt-bold txt-m color-orange block">
                Inequality (lower is better)
              </h2>
              <p className="txt=s">{Math.floor(inequality)}%</p>
            </div>
          </div>
          <div className="py12 px12 bg-black-faint">
            <div className="mb6">
              <h2 className="txt-bold txt-m color-black block">
                Visitor time spent by quartile
              </h2>
              <BarGraph width={200} height={120} />
            </div>
          </div>
          <div className="py12 px12">
            <div className="mb6">
              <h2 className="txt-bold txt-m block" data-tip data-for = 'GDPTip'>GDP Growth Potential</h2>
              <p className="txt-s">{ggp}</p>
              <ReactTooltip id = "GDPTip"> 
              <b> GDP Growth Potential </b> <br />
            Economic growth is an increase in the production <br />of 
             economic goods and services,compared from <br /> one period of  
             time to another...Traditionally, aggregate <br /> 
             economic growth is measured in terms of gross national <br /> 
            product (GNP) or gross domestic product (GDP), although
            <br />  alternative metrics are sometimes used.</ReactTooltip>
            </div>
            <div className="mb6">
            <h2 className="txt-bold txt-m block" data-tip data-for = "jobTip">Job Resilience
            {/* <Link  to = '/Research' style = {{ whiteSpace: "pre" }}>{`${'                               '}`} ? </Link>  */}
            </h2>  
            <ReactTooltip id = "jobTip" > 
            <b> Job Resilience </b> <br />The ability to adjust to career change as it happens <br />
            and,by extension, adapt to what the market demands. 
            </ReactTooltip>            <p className="txt-s">{jr}</p>
            </div>
            <div className="mb6">
            <h2 data-tip className="txt-bold txt-m block" data-for = "bgiTip">
              Business Growth Index 
              {/* <Link  to = '/Research' style = {{ whiteSpace: "pre" }}>{`${'          '}`} ? </Link>  */}
            </h2>
            <ReactTooltip id = "bgiTip" > 
            <b> Business Growth Index </b> <br />
          The growth rate is the measure of a company’s increase <br />
          in revenue and potential to expand over a set period.
            </ReactTooltip>              <p className="txt-s">{bgi}</p>
            </div>
            <div className="mb6">
              <h2 className="txt-bold txt-m block" data-tip data-for = "SATip">Included SA1 Regions</h2>
              <ReactTooltip id = "SATip"> SATip? </ReactTooltip>
              <p className="txt-s">{sa1_codes}</p>
            </div>
          </div>
        </div>
      </this.PanelContainer>
    );
  }

  render() {
    const { isDefault } = this.props.select; // const { name, description } = this.props.active;
    const { mapType } = this.props;
    if (isDefault) {
      return (
        <div className="bg-white absolute bottom right mr12 mb36 shadow-darken10 z2 wmax240">
          <div className="py12 px12">
            <p className="txt-s">
              Select a community to learn more about opportunity in that area.
            </p>
          </div>
        </div>
      );
    }

    switch (mapType) {
      case Constants.MAP_TYPE.SEGREGATION:
        return this.renderSegregationDisplay();
      // Use the same detail pane for transactions and growth layers.
      case Constants.MAP_TYPE.TRANSCATIONS:
      case Constants.MAP_TYPE.GROWTH:
      default:
        return this.renderGrowthDisplay();
    }
  }
};

function mapStateToProps(state) {
  return {
    active: state.active,
    select: state.select,
    flowDirection: state.flowDirection,
    mapType: state.mapType,
  };
}

Display = connect(mapStateToProps)(Display);

export default Display;
