import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { getHamburgerMenuOpen } from "../redux/getters";
import { setHamburgerMenuOpen } from "../redux/action-creators";

import { ReactComponent as CloseIcon} from "../assets/close-icon.svg";

const HamburgerMenu = () => {
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
    menuOpen ?
    <>
      <div className={`dim-screen ${menuOpen && "show"}`}
        onClick={() => { setHamburgerMenuOpen(false) }}
      />
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
    </>
    : <></>
  )
}

HamburgerMenu.propTypes = {
  lightBackground: PropTypes.bool,
}

export default HamburgerMenu;