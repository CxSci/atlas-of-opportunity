import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import PropTypes from 'prop-types'

import ExpandableContainer from 'components/ExpandableContainer'
import SimpleRange from 'components/SimpleRange'
import { LayoutMetricType } from 'utils/propTypes'
import { COLOR_PALETTES, filterData } from './SectionSimpleRange.utils'

const SectionSimpleRange = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const defaultContainerHeight = 360

  if (typeof layout.max !== 'undefined' && typeof layout.min !== 'undefined') {
    if (data) {
      return <SimpleRange value={data} domain={[layout.min, layout.max]} variant={layout.options.variant} />
    } else if (data === undefined) {
      return <Typography variant="fieldValue">No data</Typography>
    } else {
      return <Skeleton variant="rectangular" sx={{ borderRadius: 1 }} />
    }
  }

  if (!data) {
    return <Skeleton variant="rectangular" height={defaultContainerHeight} sx={{ borderRadius: 1 }} />
  }

  if (xAxisKey && yAxisKey && data.length) {
    const filteredData = filterData(data, layout.filters)
    return (
      <Box>
        <ExpandableContainer data={filteredData}>
          {items =>
            items.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="fieldLabel">{item[xAxisKey]}</Typography>
                <SimpleRange
                  value={item[yAxisKey]}
                  domain={[layout.y.min, layout.y.max]}
                  variant={layout.options.variant}
                  color={COLOR_PALETTES[layout.title]}
                />
              </Box>
            ))
          }
        </ExpandableContainer>
      </Box>
    )
  } else {
    return <Typography variant="fieldValue">No data</Typography>
  }
}

SectionSimpleRange.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionSimpleRange
