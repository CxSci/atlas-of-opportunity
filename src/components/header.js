import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import SegmentedControl from "./SegmentedControl";
import HamburgerMenu from "./HamburgerMenu";
import { getHamburgerMenuOpen } from "../redux/getters";
import { setHamburgerMenuOpen } from "../redux/action-creators";

import { ReactComponent as TableIcon} from "../assets/icons/table.svg";
import { ReactComponent as GridIcon} from "../assets/icons/grid.svg";
import "../css/header.css";

function Header () {
  const showDropDown = useSelector(getHamburgerMenuOpen)
  const [comparisonMode, setComparisonMode] = useState(false);
  const location = useLocation();
  const options = [
    { label: 'Table', value: 'table', icon: <TableIcon /> },
    { label: 'Grid', value: 'grid', icon: <GridIcon /> },
  ];

  useEffect(() => {
    setComparisonMode(location.pathname.startsWith('/comparison'));
  }, [location]);

  const onBGroupChange = () => {

  }

  return (
    <div className={`container ${comparisonMode && "comparisonMode"}`}>
      <div className="navbarLeft">
      </div>
      <div className="navbarCenter">
        {comparisonMode && 
          <SegmentedControl
            options={options}
            defaultValue="table"
            onChange={onBGroupChange}
            width={170}
          />
        }
      </div>
      <div className="navbarRight">
        {/* TODO: refactor hamburger menu into its own React component */}
          {
          showDropDown
            ? 
              <div className={`dim-screen ${showDropDown ? "show" : ""}`}
              onClick={() => { setHamburgerMenuOpen(false) }}
              />
            : null
          }   
          <HamburgerMenu lightBackground={comparisonMode} />
      </div>
    </div>
  );
}

export default Header;
