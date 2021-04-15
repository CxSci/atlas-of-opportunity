import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setSideBar } from "../redux/action-creators";

import "../css/sidebar.css";

let SidebarButton = class SidebarButton extends React.Component {
  static propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
  };

  toggleSidebar = () => {
    setSideBar(!this.props.sidebarOpen);
  };

  render() {
    let sidebarState = this.props.sidebarOpen ? 'open' : 'closed';
    
    return (
      <div className={`toggleButton ${sidebarState}`} onClick={this.toggleSidebar}>
        <i className={`arrow right ${sidebarState=="open"? "collapse" : "expand"}`}></i>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    sidebarOpen: state.sidebarOpen
  };
}

SidebarButton = connect(mapStateToProps)(SidebarButton);

export default SidebarButton;
