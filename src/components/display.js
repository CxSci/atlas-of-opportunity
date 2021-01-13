import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from 'react-tooltip';

import Collapsible from 'react-collapsible';

import * as Constants from "../constants";
import { setFlowDirection, setDisplayDefault } from "../redux/action-creators";
import BarGraph from "./BarGraph";
import { Header } from "semantic-ui-react";

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
    <div className="flex-parent flex-parent--column flex-parent--space-between-main absolute top left w240 h-full pt60 pb36 mr12 z2">
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

    const MenuHeader = "py12 px12 txt-bold txt-l"; 
    const ColHeader = "txt-m block";
    const ColBody = "txt-s txt-normal color-black";
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

        <div className= {MenuHeader} style = {{"background-color": "orange", color: "white"}}>
        <Collapsible className="txt-bold txt-l color-white block" trigger = 'Demographic Summary'>
          <div className="mb6">
          <hr />
            <h2 className={ColHeader} style = {{"color": "white"}}>Population</h2>
            <p className={ColBody}>{population}</p>
            <h2 className={ColHeader} style = {{"color": "white"}}>Median Income</h2>
            <p className={ColBody}>{income}</p>
          </div>
          </Collapsible>
        </div>
        
          
        <div className={MenuHeader} style = {{"background-color": "#D3D3D3", color: "black"}}>
        <Collapsible className="txt-bold txt-l color-black block" trigger = "Growth Summary">
          <div className="mb6">
            <hr/>
            <h2 className={ColHeader} data-tip data-for = "GDPTip">GDP Growth Potential
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

          <p className={ColBody}>{ggp}</p>
          </div>
          <div className="mb6">
          <h2 className= {ColHeader} data-tip data-for = "jobTip">Job Resilience
            </h2>  
            <ReactTooltip id = "jobTip" > 
            <b> Job Resilience </b> <br />The ability to adjust to career change as it happens <br />
            and,by extension, adapt to what the market demands. 
            </ReactTooltip>
            <p className={ColBody}>{jr}</p>
          </div>
          <div className="mb6">
          <h2 data-tip className={ColHeader} data-for = "bgiTip">
              Business Growth Index 
            </h2>
            <ReactTooltip id = "bgiTip" > 
            <b> Business Growth Index </b> <br />
          The growth rate is the measure of a company’s increase <br />
          in revenue and potential to expand over a set period.
            </ReactTooltip>            
            <p className= {ColBody}>{bgi}</p>
          </div>
          <div className="mb6">
            <h2 className={ColHeader} data-tip data-for = "SATip"> Included SA1 Regions</h2>
            <p className={ColBody}>{sa1_codes}</p>
          </div>
          </Collapsible>
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
    const MenuHeader = "py12 px12 txt-bold txt-l"; 
    const ColHeader = "txt-m block";
    const ColBody = "txt-s txt-normal color-black";
    const wBody = "txt-s txt-normal color-white";
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

          <div className= {MenuHeader} style = {{"background-color": "orange", color: "white"}}> 
          <Collapsible trigger = "Demographic Summary">
            <div className="mb6">
              <hr />
              <h2 className={ColHeader}>Population</h2>
              <p className={ColBody}>{population}</p>
            </div>
            <div className="mb6">
              <h2 className={ColHeader}>Median Income</h2>
              <p className={ColBody}> AUS {income}</p>
            </div>
          </Collapsible>
          </div>

          <div className= {MenuHeader} style = {{"background-color": "green", color: "white"}}> 
          <Collapsible trigger = "Economic Summary">
            <div className="mb6">
            <hr/>
              <h2 className={ColHeader}>Income Quartile</h2>
              <p className={wBody}>{quartile}</p>
            </div>
            <div className="mb6">
              <h2 className={ColHeader}> Inequality (lower is better)</h2>
              <p className={wBody} >{Math.floor(inequality)}%</p>
            </div>
           
            <div className="mb6">
              <h2 className={ColHeader}>
                Visitor time spent by quartile
              </h2>
              <BarGraph width={200} height={120} />
            </div>
            </Collapsible>
          </div>
         
          <div className= {MenuHeader} style = {{"background-color": "#D3D3D3", color: "black"}}> 
          <Collapsible trigger = "Growth Summary">
              <div className="mb6">
                <hr />
                <h2 className={ColHeader} data-tip data-for = 'GDPTip'>GDP Growth Potential</h2>
                <p className= {ColBody}>{ggp}</p>
                  <ReactTooltip id = "GDPTip"> 
                  <b> GDP Growth Potential </b> <br />
                Economic growth is an increase in the production <br />of 
                economic goods and services,compared from <br /> one period of  
                time to another...Traditionally, aggregate <br /> 
                economic growth is measured in terms of gross national <br /> 
                product (GNP) or gross domestic product (GDP), although
                <br />  alternative metrics are sometimes used.
                </ReactTooltip>
              </div>
              <div className="mb6">
              <h2 className={ColHeader} data-tip data-for = "jobTip">Job Resilience</h2>  
                <ReactTooltip id = "jobTip" > 
                <b> Job Resilience </b> <br />The ability to adjust to career change as it happens <br />
                and,by extension, adapt to what the market demands. 
                </ReactTooltip>            
              <p className={ColBody}>{jr}</p>
              </div>
              <div className="mb6">
              <h2 data-tip className={ColHeader} data-for = "bgiTip">
                Business Growth Index 
              </h2>
                <ReactTooltip id = "bgiTip" > 
                <b> Business Growth Index </b> <br />
              The growth rate is the measure of a company’s increase <br />
              in revenue and potential to expand over a set period.
                </ReactTooltip>              
              <p className={ColBody}>{bgi}</p>
              </div>
              <div className="mb6">
                <h2 className={ColHeader} data-tip data-for = "SATip">Included SA1 Regions</h2>
                <p className={ColBody}>{sa1_codes}</p>
              </div>
            </Collapsible>
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
