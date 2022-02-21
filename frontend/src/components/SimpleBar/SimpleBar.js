import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import PropTypes from 'prop-types'

import { NumberFormatType } from 'utils/propTypes'
import FieldNumber from 'components/FieldNumber'

const SimpleBar = ({ value, percentage, numberFormat }) => {
  return (
    <Grid container spacing={1} alignItems="center" flexWrap="nowrap">
      <Grid item flex={1}>
        <Box sx={{ position: 'relative', width: `${(percentage || value) * 100}%` }}>
          <LinearProgress value={100} sx={{ height: 24, borderRadius: 1 }} variant="determinate" color="secondary" />
          <Box sx={{ position: 'absolute', left: '100%', top: '50%', ml: 1, transform: 'translateY(-50%)' }}>
            <FieldNumber value={value} numberFormat={numberFormat} />
          </Box>
        </Box>
      </Grid>
      <Grid item sx={{ visibility: 'hidden' }}>
        {/* render again to make it take up space for the number rendered above*/}
        <FieldNumber value={value} numberFormat={numberFormat} />
      </Grid>
    </Grid>
  )
}

SimpleBar.propTypes = {
  value: PropTypes.number.isRequired,
  percentage: PropTypes.number,
  numberFormat: NumberFormatType,
}

export default SimpleBar
