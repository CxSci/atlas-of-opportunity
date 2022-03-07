import PropTypes from 'prop-types'

export const NumberFormatType = PropTypes.shape({
  style: PropTypes.string.isRequired,
  currency: PropTypes.string,
  maximumFractionDigits: PropTypes.number,
  minimumIntegerDigits: PropTypes.number,
  minimumSignificantDigits: PropTypes.number,
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

export const ChartAxisType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  format: PropTypes.string,
  numberFormat: NumberFormatType,
})

export const MetricFilterType = PropTypes.shape({
  key: PropTypes.string,
  control: PropTypes.oneOf(['select']),
  title: PropTypes.string,
  default_value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
})
