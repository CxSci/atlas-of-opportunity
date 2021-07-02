import React from "react"
import PropTypes from "prop-types"
import ReactTooltip from "react-tooltip"

const TooltipMetric = ({ title, metric }) => {
  return (
    <ReactTooltip id={metric.id}>
      <strong>{title}</strong>
      <div style={{maxWidth: 400}}>
        {metric.desc}
      </div>
    </ReactTooltip>
  )
}

TooltipMetric.propTypes = {
  title: PropTypes.string,
  metric: PropTypes.any,
}

export default TooltipMetric
