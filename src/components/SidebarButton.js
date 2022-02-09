import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setSidebar } from "../redux/action-creators";
import { ReactComponent as ChevronLeftIcon} from "../assets/chevron_left.svg"
import { ReactComponent as ChevronRightIcon} from "../assets/chevron_right.svg"

import "../css/Sidebar.css";

let SidebarButton = class SidebarButton extends React.Component {
  static propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
  };

  toggleSidebar = () => {
    setSidebar(!this.props.sidebarOpen);
  };

  render() {
    let sidebarState = this.props.sidebarOpen ? 'open' : 'closed';
    
    return (
      <div className={`toggleButton`} onClick={this.toggleSidebar}>
        {sidebarState === "open" ? (<ChevronLeftIcon/>) : (<ChevronRightIcon/>)}
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
