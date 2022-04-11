import { useRef } from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import PropTypes from 'prop-types'

import LineChart from 'components/LineChart'
import { LayoutMetricType } from 'utils/propTypes'
import { useClientSize } from 'hooks/victory'

const SectionLine = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const ref = useRef()
  const defaultContainerWidth = 560
  const defaultContainerHeight = 360
  const size = useClientSize(ref, defaultContainerWidth, defaultContainerHeight, 0.6)

  if (data) {
    const chartData = data.map(item => ({
      x: item[xAxisKey],
      y: item[yAxisKey],
    }))
    return (
      <Box ref={ref}>
        <LineChart data={chartData} title={layout.title} xAxis={layout.x} yAxis={layout.y} />
      </Box>
    )
  } else {
    return <Skeleton variant="rectangular" {...size} sx={{ borderRadius: 1 }} />
  }
}

SectionLine.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionLine
