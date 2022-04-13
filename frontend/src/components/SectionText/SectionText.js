import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import PropTypes from 'prop-types'

import FieldNumber from 'components/FieldNumber'
import ExpandableContainer from 'components/ExpandableContainer'
import { LayoutMetricType } from 'utils/propTypes'

const SectionText = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  const defaultContainerHeight = 300

  if (layout.format === 'number') {
    if (data) {
      return <FieldNumber value={data || 0} numberFormat={layout.numberFormat} />
    } else {
      return <Skeleton variant="text" />
    }
  }

  if (xAxisKey && yAxisKey && data) {
    return (
      <Box>
        <ExpandableContainer data={data} filters={layout.filters}>
          {items =>
            items.map((item, index) => (
              <Box key={index}>
                <Typography variant="fieldLabel">{item[xAxisKey]}</Typography>
                {layout.y?.format === 'number' && (
                  <FieldNumber value={item[yAxisKey] || 0} numberFormat={layout.y.numberFormat} gutterBottom />
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

SectionText.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionText
