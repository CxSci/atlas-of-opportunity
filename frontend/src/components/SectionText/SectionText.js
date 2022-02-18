import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

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

export default SectionText
