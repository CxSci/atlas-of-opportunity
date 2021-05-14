import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { setHeaderOption } from "../redux/action-creators";

import "../css/header.css";
import { ReactComponent as CloseIcon} from "../assets/close-icon.svg";

function Header () {
  const [showDropDown, setShowDropDown] = useState(false)
  const toggleDropDown = useCallback(() => setShowDropDown(state => !state), []);
  const [comparisonMode, setComparisonMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setComparisonMode(location.pathname.startsWith('/comparison'));
  }, [location]);

  // const history = useHistory();
  // history.listen(location => {
  //   setComparisonMode(location.pathname.startsWith('/comparison'));
  // })

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
          showDropDown
            ? 
              <div className={`dim-screen ${showDropDown ? "show" : ""}`}
              onClick={() => { setShowDropDown(false) }}
              />
            : null
          }   
        <div className="dropdown-menu">
          <button className={`menu-icon ${comparisonMode ? 'black' : 'white'}`} onClick={toggleDropDown}>
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
              to="/methods"
              onClick={() => setHeaderOption("/methods"),
              toggleDropDown}
            >
              Methods
            </Link>
            <Link
              to="/research"
              onClick={() => setHeaderOption("/research"),
              toggleDropDown}
            >
              Research
            </Link>
            <Link
              to="/about"
              onClick={() => setHeaderOption("/about"),
              toggleDropDown}
            >
              About
            </Link>
            <Link
              to="/faq"
              onClick={() => setHeaderOption("/faq"),
              toggleDropDown}
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
