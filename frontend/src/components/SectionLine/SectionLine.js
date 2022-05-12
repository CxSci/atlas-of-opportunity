import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'

import LineChart from 'components/LineChart'
import { LayoutMetricType } from 'utils/propTypes'

const SectionLine = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const zAxisKey = layout.z?.key
  const defaultContainerHeight = 400

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
        <LineChart data={chartData} title={layout.title} xAxis={layout.x} yAxis={layout.y} variant={layout.variant} />
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

SectionLine.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionLine
