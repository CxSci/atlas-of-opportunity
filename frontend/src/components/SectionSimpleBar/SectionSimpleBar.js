import Box from '@mui/material/Box'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

import SimpleBar from 'components/SimpleBar'
import { LayoutMetricType } from 'utils/propTypes'

const SectionSimpleBar = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  if (layout.format === 'number') {
    const { min, max } = layout
    const percentage = (data - min) / (max - min || 1)
    return <SimpleBar value={data} numberFormat={layout.numberFormat} percentage={percentage} />
  }
  if (xAxisKey && yAxisKey) {
    const maxValue = data.reduce(
      (maxValue, item) => (item[yAxisKey] > maxValue ? item[yAxisKey] : maxValue),
      data.length > 0 ? data[0][yAxisKey] : 1,
    )
    return (
      <Box>
        {data.map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="fieldLabel">{item[xAxisKey]}</Typography>
            {layout.y?.format === 'number' && (
              <SimpleBar
                value={item[yAxisKey]}
                percentage={item[yAxisKey] / maxValue}
                numberFormat={layout.y.numberFormat}
              />
            )}
          </Box>
        ))}
      </Box>
    )
  }

  return null
}

SectionSimpleBar.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionSimpleBar
