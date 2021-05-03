import React from "react"
import PropTypes from "prop-types"

import { ReactComponent as CancelIcon} from "../assets/search-icons/cancel.svg"

function BigTitle({ children, onCancel, onFocus }) {
    return (
      <div className="bigTitle">
        <div className="titleButton" onClick={onFocus}>
          <div className="titleUnderline">
            { children }
          </div>
        </div>
        <div className="cancelButton" onClick={onCancel}>
          <div className="cancelUnderline">
            <CancelIcon />
          </div>
        </div>
      </div>
    )
}

BigTitle.propTypes = {
  children: PropTypes.node,
  onCancel: PropTypes.func,
  onFocus: PropTypes.func,
  title: PropTypes.string,
}

export default BigTitle