import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SegmentedControl from "./SegmentedControl";
import { setHamburgerMenuOpen } from "../redux/action-creators";

import { ReactComponent as TableIcon} from "../assets/icons/table.svg";
import { ReactComponent as GridIcon} from "../assets/icons/grid.svg";
import "../css/header.css";

function Header () {
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
