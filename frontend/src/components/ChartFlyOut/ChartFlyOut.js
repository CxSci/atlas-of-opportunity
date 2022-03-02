import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Portal from '@mui/material/Portal'
import Typography from '@mui/material/Typography'
import { FormattedNumber } from 'react-intl'
import { PropTypes } from 'prop-types'
import { useRef } from 'react'
import { useTheme } from '@mui/system'

const ChartFlyOut = ({ x, y, datum, title, xAxisLabel, yAxisLabel, style }) => {
  const ref = useRef(null)
  const rect = ref.current?.getBoundingClientRect()
  console.log({ rect }, ref.current)
  const theme = useTheme()
  return (
    <g style={{ pointerEvents: 'none' }} ref={ref}>
      <Portal container={document.body}>
        <Box
          style={{
            left: x + (rect?.left || 0) + window.scrollX,
            top: y + (rect?.top || 0) + window.scrollY,
          }}
          sx={{
            position: 'absolute',
            transform: 'translate(-50%, -100%)',
            zIndex: theme.zIndex.tooltip,
            visibility: ref.current ? 'visible' : 'hidden',
          }}>
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
      </Portal>
    </g>
  )
}

ChartFlyOut.propTypes = {
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  y: PropTypes.number,
  datum: PropTypes.object,
}

export default ChartFlyOut
