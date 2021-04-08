import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from 'react-tooltip';
import Collapsible from "react-collapsible";

import * as Constants from "../constants";
import { setDisplayDefault } from "../redux/action-creators";
import BarGraph from "./BarGraph";
import SearchBar from "./searchbar";
import "../css/collapsible.css";
import "../css/sidebar.css";

let Display = class Display extends React.Component {
  static propTypes = {
    active: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    mapType: PropTypes.string.isRequired, // one of { growth,segregation}
    searchBarInfo: PropTypes.arrayOf(PropTypes.number),
  };

  state = {
    showSidebar: true,
  };

  toggleSidebar = () => {
    this.setState(prevState => ({ showSidebar: !prevState.showSidebar }));
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

    const { mapType } = this.props;

    const PanelContainer = (props) => (
      <div className={`panel-container absolute top left h-full mr12 z2`}>
        {props.children}
      </div>
    );

    const SidebarButton = () => (
      <div className={`toggleButton ${sidebarState}`} onClick={this.toggleSidebar}>
        <i className={`arrow right ${sidebarState=="open"? "collapse" : "expand"}`}></i>
      </div>
    )

    const TopPanel = () => (
      <div
        style={{ overflowY: "auto" }}
        className={`sidebar bg-white flex-child flex-child--grow shadow-darken10 w300`}
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

    return (
      <PanelContainer>
        <SidebarButton/>
        <div className={`sidebar-container  ${sidebarState} `}>
          <SearchBar/>
          <TopPanel />
        </div>
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
    mapType: state.mapType,
    searchBarInfo: state.searchBarInfo,
  };
}

Display = connect(mapStateToProps)(Display);

export default Display;
