import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FormattedNumber } from 'react-intl'

const SectionNumber = ({ value, numberFormat }) => (
  <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
    <FormattedNumber value={value} {...numberFormat} />
  </Typography>
)

const SectionText = ({ layout, data }) => {
  const xAxisKey = layout.x?.key
  const yAxisKey = layout.y?.key
  if (layout.format === 'number') {
    return <SectionNumber value={data} numberFormat={layout.numberFormat} />
  }

  if (xAxisKey && yAxisKey) {
    return (
      <Box>
        {data.map((item, index) => (
          <Box key={index}>
            <Typography variant="body2">{item[xAxisKey]}</Typography>
            {layout.y?.format === 'number' && (
              <SectionNumber value={item[yAxisKey]} numberFormat={layout.y.numberFormat} />
            )}
          </Box>
        ))}
      </Box>
    )
  }

  return null
}

export default SectionText
