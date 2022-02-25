import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { FormattedNumber } from 'react-intl'
import { PropTypes } from 'prop-types'

const ChartFlyOut = ({ x, y, datum, title, xAxisLabel, yAxisLabel, style }) => (
  <g style={{ pointerEvents: 'none' }}>
    <foreignObject width="100%" height="100%" style={{ overflow: 'visible' }}>
      <Box sx={{ m: 1, left: x, top: y, position: 'absolute', transform: 'translate(-50%, -100%)' }}>
        <Box sx={{ borderRadius: 1, boxShadow: 3, bgcolor: '#FFFFFF', p: 2, mb: 4 }}>
          <Grid container alignItems="center" sx={{ mb: 1, flexWrap: 'nowrap' }}>
            <Grid item>
              <Box
                sx={{
                  border: 1,
                  borderColor: style.stroke,
                  bgcolor: style.fill,
                  borderRadius: '50%',
                  width: 12,
                  height: 12,
                  mr: 1,
                }}
              />
            </Grid>
            <Grid item flex={1}>
              <Typography variant="body2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                {title}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="fieldLabel">{yAxisLabel}</Typography>
          <Typography variant="fieldValue" sx={{ mb: 1 }}>
            <FormattedNumber value={datum.y} />
          </Typography>
          <Typography variant="fieldLabel">{xAxisLabel}</Typography>
          <Typography variant="fieldValue">{datum.x}</Typography>
        </Box>
      </Box>
    </foreignObject>
  </g>
)

ChartFlyOut.propTypes = {
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  y: PropTypes.number,
  datum: PropTypes.object,
}

export default ChartFlyOut
