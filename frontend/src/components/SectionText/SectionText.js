import Box from '@mui/material/Box'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'

import { LayoutMetricType } from 'utils/propTypes'
import FieldNumber from 'components/FieldNumber'

const SectionText = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  if (layout.format === 'number') {
    return <FieldNumber value={data} numberFormat={layout.numberFormat} />
  }

  if (xAxisKey && yAxisKey) {
    return (
      <Box>
        {data.map((item, index) => (
          <Box key={index}>
            <Typography variant="fieldLabel">{item[xAxisKey]}</Typography>
            {layout.y?.format === 'number' && (
              <FieldNumber value={item[yAxisKey]} numberFormat={layout.y.numberFormat} gutterBottom />
            )}
          </Box>
        ))}
      </Box>
    )
  }

  return null
}

SectionText.propTypes = {
  layout: LayoutMetricType,
  data: PropTypes.any,
}

export default SectionText
