import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from 'react-tooltip';
import Collapsible from "react-collapsible";

import BarGraph from "./BarGraph";
import SidebarButton from "./SidebarButton";
import SASearchField from "./SASearchField";
import "../css/collapsible.css";
import "../css/sidebar.css";

let Sidebar = class Sidebar extends React.Component {
  static propTypes = {
    select: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object,
  };

  render() {
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

    const PanelContainer = (props) => {
      const featureSelected = this.props.selectedFeature ? 'featureSelected' : 'noFeatureSelected'
      return (
        <div className={`panel-container ${featureSelected}`}>
        {props.children}
      </div>
      )
    }

    const TopPanel = () => (
      <div
        style={{ overflowY: "auto" }}
        className={`sidebar`}
      >
        <div className="py12 px12" style = {{backgroundColor: "lightgray"}}>
            <h2 className="txt-bold txt-l txt-uppercase block">{sa2_name}</h2>
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

    // const featureDebug = (feature) => {
    //   if (!feature || !feature.properties) {
    //     return ""
    //   }
    //   return (
    //     <ul className="sidebar-content">
    //     {
    //       Object.keys(feature.properties).map((key) => (
    //         <li key={key}>{key}: {feature.properties[key]}</li>
    //       ))
    //     }
    //     </ul>
    //   )
    // }

    return (
      <PanelContainer>
        <SidebarButton/>
        <div className={`sidebar-container`}>
            <SASearchField />
          {this.props.selectedFeature ?
            <div className="sidebar-content"><TopPanel /></div> :
            ""
          }
          
        </div>
      </PanelContainer>
    );
  }
};

function mapStateToProps(state) {
  return {
    select: state.select,
    selectedFeature: state.selectedFeature,
  };
}

Sidebar = connect(mapStateToProps)(Sidebar);

export default Sidebar;
