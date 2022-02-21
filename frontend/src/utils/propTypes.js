import PropTypes from 'prop-types'

export const NumberFormatType = PropTypes.shape({
  style: PropTypes.string.isRequired,
  currency: PropTypes.string,
  maximumFractionDigits: PropTypes.number,
})

export const LayoutAxisType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  format: PropTypes.oneOf(['plan', 'number']),
  numberFormat: NumberFormatType,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
})

export const LayoutMetricType = PropTypes.shape({
  title: PropTypes.string,
  key: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  format: PropTypes.oneOf(['plan', 'number']),
  numberFormat: NumberFormatType,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  x: LayoutAxisType,
  y: LayoutAxisType,
  filters: PropTypes.array,
  min: PropTypes.number,
  max: PropTypes.number,
})
