import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setSideBar } from "../redux/action-creators";
import { ReactComponent as ChevronLeftIcon} from "../assets/chevron_left.svg"
import { ReactComponent as ChevronRightIcon} from "../assets/chevron_right.svg"

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
        {sidebarState=="open" ? (<ChevronLeftIcon/>) : (<ChevronRightIcon/>)}
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
