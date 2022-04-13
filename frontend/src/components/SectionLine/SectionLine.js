import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import PropTypes from 'prop-types'

import LineChart from 'components/LineChart'
import { LayoutMetricType } from 'utils/propTypes'

const SectionLine = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const defaultContainerHeight = 360

  if (data) {
    const chartData = data.map(item => ({
      x: item[xAxisKey],
      y: item[yAxisKey],
    }))
    return (
      <Box>
        <LineChart data={chartData} title={layout.title} xAxis={layout.x} yAxis={layout.y} />
      </Box>
    )
  } else {
    return <Skeleton variant="rectangular" height={defaultContainerHeight} sx={{ borderRadius: 1 }} />
  }
}

SectionLine.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionLine
