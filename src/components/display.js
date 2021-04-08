import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from 'react-tooltip';
import Collapsible from "react-collapsible";

import * as Constants from "../constants";
import { setFlowDirection, setDisplayDefault } from "../redux/action-creators";
import BarGraph from "./BarGraph";
import "../css/collapsible.css";
import "../css/sidebar.css";

let Display = class Display extends React.Component {
  static propTypes = {
    active: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    mapType: PropTypes.string.isRequired, // one of { growth,segregation}
    flowDirection: PropTypes.string.isRequired,
  };

  state = {
    showSidebar: true,
  };

  toggleSidebar = () => {
    this.setState(prevState => ({ showSidebar: !prevState.showSidebar }));
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

  renderDisplay() {
    let sidebarState = this.state.showSidebar ? 'open' : 'closed';
     
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

    const { flowDirection, mapType } = this.props;

    const PanelContainer = (props) => (
      <div className="sidebar-container flex-parent flex-parent--column flex-parent--space-between-main absolute top left w240 h-full pt60 pb36 mr12 z2">
        {props.children}
      </div>
    );

    const SidebarButton = () => (
      <div className={`toggleButton`} onClick={this.toggleSidebar}>
        <i className={`arrow right ${sidebarState=="open"? "collapse" : "expand"}`}></i>
      </div>
    )

    const TopPanel = () => (
      <div
        style={{ overflowY: "auto" }}
        className={`sidebar ${sidebarState} bg-white flex-child flex-child--grow shadow-darken10 w300`}
      >
        <div className="py12 px12" style = {{backgroundColor: "lightgray"}}>
            <h2 className="txt-bold txt-l txt-uppercase block">{sa2_name}</h2>
        </div>
        <div className="py12 px12">
          <div className="mb6">
            <h3>
            {mapType === "growth"? "Pattern of Mobility"
            : mapType === "segregation"? "Economic Inequality"
            :"Pattern of Spending"}
            </h3>
          </div>
        </div>

        <Collapsible trigger = "Demographic Summary" >
             <h2>Population</h2>
              <p>{population}</p>
              <h2>Median Income</h2>
              <p>{income}</p>
          </Collapsible>
          
          <Collapsible trigger = "Economic Summary" >
              <h2>Income Quartile</h2>
              <p>{quartile}</p>
              <h2> Inequality (lower is better)</h2>
              <p>{Math.floor(inequality)}%</p>
              <h2>Visitor time spent by quartile</h2><div>
              <BarGraph width={200} height={120} />
              </div>
            </Collapsible>

        <Collapsible trigger = "Growth Summary " >
            <h2 data-tip data-for = "GDPTip">GDP Growth Potential</h2>
            <ReactTooltip id = "GDPTip" > 
            <b> GDP Growth Potential </b> <br />
            Economic growth is an increase in the production <br />of 
             economic goods and services,compared from <br /> one period of  
             time to another...Traditionally, aggregate <br /> 
             economic growth is measured in terms of gross national <br /> 
            product (GNP) or gross domestic product (GDP), although
            <br />  alternative metrics are sometimes used.
            </ReactTooltip>
          <p>{ggp}</p>
            <h2 data-tip data-for = "jobTip">Job Resilience</h2>  
            <ReactTooltip id = "jobTip" > 
            <b> Job Resilience </b> <br />The ability to adjust to career change as it happens <br />
            and,by extension, adapt to what the market demands. 
            </ReactTooltip>
            <p>{jr}</p>
          <h2 data-tip data-for = "bgiTip">
              Business Growth Index 
            </h2>
            <ReactTooltip id = "bgiTip" > 
            <b> Business Growth Index </b> <br />
          The growth rate is the measure of a company’s increase <br />
          in revenue and potential to expand over a set period.
            </ReactTooltip>            
            <p>{bgi}</p>
            <h2 data-tip data-for = "SATip"> Included SA1 Regions</h2>
            <p>{sa1_codes}</p>
          </Collapsible>
      </div>
    );

    const BottomPanel = () => (
      <div className="bg-white flex-child flex-child--no-shrink ml30 shadow-darken10 w240"> 
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
        </div>
      </div>
    );
    return (
      <PanelContainer>
        <SidebarButton/>
        <TopPanel />
        <BottomPanel />
      </PanelContainer>
    );
  }

  render() {
    const { isDefault } = this.props.select; // const { name, description } = this.props.active;
    const { mapType } = this.props;
    if (isDefault) {
      return (
        <div className="wmax240">
        </div>
      );
    }

    switch (mapType) {
      case Constants.MAP_TYPE.SEGREGATION:
      case Constants.MAP_TYPE.TRANSCATIONS:
      case Constants.MAP_TYPE.GROWTH:
      default:
        return this.renderDisplay();
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
