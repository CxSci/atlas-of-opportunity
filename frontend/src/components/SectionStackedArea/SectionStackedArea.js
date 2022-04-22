import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'

import StackChart from 'components/StackChart'
import { LayoutMetricType } from 'utils/propTypes'

const SectionStackedArea = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const zAxisKey = layout.z?.key
  const defaultContainerHeight = 350

  if (!data) {
    return <Skeleton variant="rectangular" height={defaultContainerHeight} sx={{ borderRadius: 1 }} />
  }

  if (data.length) {
    const chartData = data.map(item => ({
      x: item[xAxisKey],
      y: item[yAxisKey],
      z: item[zAxisKey],
    }))
    return (
      <Box>
        <StackChart data={chartData} title={layout.title} xAxis={layout.x} yAxis={layout.y} />
      </Box>
    )
  } else {
    return (
      <Box
        sx={{
          overflow: 'hidden',
          background: '#F2F2F2',
          height: defaultContainerHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Typography variant="fieldValue">No data</Typography>
      </Box>
    )
  }
}

SectionStackedArea.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionStackedArea
