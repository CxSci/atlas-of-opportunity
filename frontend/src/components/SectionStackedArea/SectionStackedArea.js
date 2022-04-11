import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import PropTypes from 'prop-types'

import StackChart from 'components/StackChart'
import { LayoutMetricType } from 'utils/propTypes'
import { useClientSize } from 'hooks/victory'

const SectionStackedArea = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const zAxisKey = layout.z?.key
  const ref = useRef()
  const defaultContainerWidth = 500
  const defaultContainerHeight = 350
  const size = useClientSize(ref, defaultContainerWidth, defaultContainerHeight)

  if (layout && data) {
    const chartData = data.map(item => ({
      x: item[xAxisKey],
      y: item[yAxisKey],
      z: item[zAxisKey],
    }))
    return (
      <Box ref={ref}>
        <StackChart data={chartData} title={layout.title} xAxis={layout.x} yAxis={layout.y} />
      </Box>
    )
  } else {
    return <Skeleton variant="rectangular" {...size} sx={{ borderRadius: 1 }} />
  }
}

SectionStackedArea.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionStackedArea
