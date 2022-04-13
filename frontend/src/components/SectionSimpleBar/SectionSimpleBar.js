import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import PropTypes from 'prop-types'

import ExpandableContainer from 'components/ExpandableContainer'
import SimpleBar from 'components/SimpleBar'
import { LayoutMetricType } from 'utils/propTypes'

const SectionSimpleBar = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const defaultContainerHeight = 250

  if (layout.format === 'number') {
    const { min, max } = layout
    if (data) {
      const percentage = (data - min) / (max - min || 1)
      return <SimpleBar value={data} numberFormat={layout.numberFormat} percentage={percentage} />
    } else {
      return <Skeleton variant="rectangular" sx={{ borderRadius: 1 }} />
    }
  }

  if (xAxisKey && yAxisKey && data) {
    const maxValue = data.reduce(
      (maxValue, item) => (item[yAxisKey] > maxValue ? item[yAxisKey] : maxValue),
      data.length > 0 ? data[0][yAxisKey] : 1,
    )
    return (
      <Box>
        <ExpandableContainer data={data}>
          {items =>
            items.map((item, index) => (
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
            ))
          }
        </ExpandableContainer>
      </Box>
    )
  } else {
    return <Skeleton variant="rectangular" height={defaultContainerHeight} sx={{ borderRadius: 1 }} />
  }
}

SectionSimpleBar.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionSimpleBar
