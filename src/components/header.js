import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { setHeaderOption } from "../redux/action-creators";

import "../css/header.css";
import { ReactComponent as CloseIcon} from "../assets/close-icon.svg";


const Header = class Header extends Component {  
  container = React.createRef();

  static propTypes = {
    path: PropTypes.string.isRequired,
  };

  state = {
    showDropDown: false,
  };

  toggleDropDown = () => {
    this.setState(prevState => ({ showDropDown: !prevState.showDropDown }),);
  };

  render() {
    const { showDropDown } = this.state;
  
    const headerBox = {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      alignContent: "center",
      alignItems: "center",
    };
 
    return (
      <div className="container" style={headerBox}>
        {/* TODO: make header background color translucent white while in comparison mode */}
        <div className="navbarLeft">
          {/* TODO: put conditional sidebar toggle control here */}
        </div>
        <div className="navbarCenter">
          {/* TODO: put conditional comparison controls here */}
        </div>
        <div className="navbarRight">
          {/* TODO: refactor hamburger menu into its own React component */}
          {/* TODO: make menu's color dark while in comparison mode
                    and when viewing static pages */}
          {/* TODO: convert to use a similar downshift/popper setup as
                    the dropdownSelect */}
          {
          this.state.showDropDown
            ? 
              <div className={`dim-screen ${showDropDown ? "show" : ""}`}
              onClick={() => { this.setState({ /* turn stuff off */
                showDropDown: false }) }}
              />
            : null
          }   
          <div className="dropdown-menu" ref={this.container}>
            <button className="menu-icon" onClick={this.toggleDropDown}>
              <div className="menu-icon-bar"></div>
              <div className="menu-icon-bar"></div>
              <div className="menu-icon-bar"></div>
            </button>
          
          <div className={`dropdown-content ${showDropDown ? "show" : ""}`}>
            <div className="dropdown-header">
              <div className="menu-title">Atlas of Opportunity</div>
              <div className="close-icon"><CloseIcon/></div>
             </div>
     
      
              <Link
                to={{
                  pathname: '/methods',
                }}
                onClick={() => 
                  {setHeaderOption("/methods");
                  this.toggleDropDown()}
              }
              >
                Methods
              </Link>
             
              
              <Link
                to={{
                  pathname: '/research',
                }}
                onClick={() => {setHeaderOption("/research");
                this.toggleDropDown()}}
              >
                Research
              </Link>

              <Link
                to={{
                pathname: '/faq',
              }}
                onClick={() => {setHeaderOption("/faq");
                this.toggleDropDown()}}
              >
                Frequently Asked Questions
              </Link>
              <Link
                to={{
                  pathname: '/about',
                }}
                onClick={() => {setHeaderOption("/about");
                this.toggleDropDown()}}
              >
                About the Atlas
              </Link>


            </div>
            </div>
          </div>
        </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    path: state.path,
  };
}



export default connect(mapStateToProps)(Header);
