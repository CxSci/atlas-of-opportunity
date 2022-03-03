import PropTypes from 'prop-types'

import StackChart from 'components/StackChart'
import { LayoutMetricType } from 'utils/propTypes'

const SectionStackedArea = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const zAxisKey = layout.z?.key
  const chartData = data.map(item => ({
    x: item[xAxisKey],
    y: item[yAxisKey],
    z: item[zAxisKey],
  }))

  return <StackChart data={chartData} title={layout.title} xAxis={layout.x} yAxis={layout.y} />
}

SectionStackedArea.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionStackedArea
