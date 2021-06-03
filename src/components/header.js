import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { setHeaderOption, setComparisonType } from "../redux/action-creators";

import { ReactComponent as CloseIcon} from "../assets/close-icon.svg";
import { ReactComponent as TableIcon} from "../assets/icons/table.svg";
import { ReactComponent as GridIcon} from "../assets/icons/grid.svg";
import SegmentedControl from "./SegmentedControl";
import "../css/header.css";
import { COMPARISON_TYPE } from "../constants";

function Header () {
  const [showDropDown, setShowDropDown] = useState(false)
  const toggleDropDown = useCallback(() => setShowDropDown(state => !state), []);
  const [comparisonMode, setComparisonMode] = useState(false);
  const location = useLocation();
  const options = [
    { label: 'Table', value: COMPARISON_TYPE.TABLE, icon: <TableIcon /> },
    { label: 'Grid', value: COMPARISON_TYPE.GRID, icon: <GridIcon /> },
  ];

  useEffect(() => {
    setComparisonMode(location.pathname.startsWith('/comparison'));
  }, [location]);

  const onSegmentedControlChange = (value) => {
    setComparisonType(value);
  }

  return (
    <div className={`container ${comparisonMode && "comparisonMode"}`}>
      <div className="navbarLeft">
      </div>
      <div className="navbarCenter">
        {comparisonMode && 
          <SegmentedControl
            options={options}
            defaultValue={COMPARISON_TYPE.TABLE}
            onChange={onSegmentedControlChange}
            width={170}
          />
        }
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
