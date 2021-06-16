import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SegmentedControl from "./SegmentedControl";
import { COMPARISON_TYPE } from "../constants";
import { useSelector } from "react-redux";
import { getComparisonType } from "../redux/getters";
import { setComparisonType } from "../redux/action-creators";
import { setHamburgerMenuOpen } from "../redux/action-creators";

import { ReactComponent as TableIcon} from "../assets/icons/table.svg";
import { ReactComponent as GridIcon} from "../assets/icons/grid.svg";

import "../css/header.css";

function Header () {
  const comparisonType = useSelector(getComparisonType);
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
            defaultValue={comparisonType}
            onChange={onSegmentedControlChange}
            width={170}
          />
        }
      </div>
      <div className="navbarRight">
        <button className={`hamburgerButton ${comparisonMode ? "black" : "white"}`}
          onClick={() => setHamburgerMenuOpen(true)}
        >
          <div className="menu-icon-bar"></div>
          <div className="menu-icon-bar"></div>
          <div className="menu-icon-bar"></div>
        </button>
      </div>
    </div>
  );
}

export default Header;
