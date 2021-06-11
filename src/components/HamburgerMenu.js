import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { getHamburgerMenuOpen } from "../redux/getters";
import { setHamburgerMenuOpen } from "../redux/action-creators";

import { ReactComponent as CloseIcon} from "../assets/close-icon.svg";

const HamburgerMenu = ({lightBackground = false}) => {
  const menuOpen = useSelector(getHamburgerMenuOpen)
  const toggleMenuOpen = () => setHamburgerMenuOpen(!menuOpen)

  const sections = [
    [
      { url: "/methods", title: "Methods", },
      { url: "/research", title: "Research", },
      { url: "/about", title: "About", },
      { url: "/faq", title: "FAQ", },
    ],
    [
      { url: "/recommendation", title: "Recommendation", },
    ]
  ]

  return (
    <div className="dropdown-menu">
      <button className={`menu-icon ${lightBackground ? "black" : "white"}`} onClick={toggleMenuOpen}>
        <div className="menu-icon-bar"></div>
        <div className="menu-icon-bar"></div>
        <div className="menu-icon-bar"></div>
      </button>
      <div className={`dropdown-content ${menuOpen && "show"}`}>
      <div className="dropdown-header">
        <div className="menu-title">Atlas of Opportunity</div>
          <button className="close-icon" onClick={toggleMenuOpen}>
            <CloseIcon/>
          </button>
        </div>
        { sections.map((choices, idx) => 
          <div key={idx} className="dropdownSection">
            { choices.map((choice, idx) =>
              <Link key={idx}
                to={choice.url}
                onClick={toggleMenuOpen}
              >
                {choice.title}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

HamburgerMenu.propTypes = {
  lightBackground: PropTypes.bool,
}

export default HamburgerMenu;