import PropTypes from 'prop-types'

import LineChart from 'components/LineChart'
import { LayoutMetricType } from 'utils/propTypes'

const SectionLine = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const chartData = data.map(item => ({
    x: item[xAxisKey],
    y: item[yAxisKey],
  }))

  return <LineChart data={chartData} title={layout.title} xAxisLabel={layout.x.title} yAxisLabel={layout.y.title} />
}

SectionLine.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionLine
