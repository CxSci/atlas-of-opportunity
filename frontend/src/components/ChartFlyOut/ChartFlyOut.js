import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Portal from '@mui/material/Portal'
import Typography from '@mui/material/Typography'
import { FormattedNumber } from 'react-intl'
import { PropTypes } from 'prop-types'
import { useRef } from 'react'
import { useTheme } from '@mui/system'

const ChartFlyOut = ({ x, y, datum, title, xAxisLabel, yAxisLabel, style, placement, activePoints, variant }) => {
  const ref = useRef(null)
  const rect = ref.current?.getBoundingClientRect()
  const theme = useTheme()
  const activeData = activePoints[0]?.style?.data
  const circleBgColor = activeData ? activeData.fill : style.fill
  const circleStrokeColor = activeData ? activeData.stroke || '#FFFFFF' : style.stroke

  return (
    <>
      <g style={{ pointerEvents: 'none' }}>
        <circle cx={x} cy={y} r={6} fill={circleBgColor} stroke={circleStrokeColor} strokeWidth={2} />
      </g>
      <g style={{ pointerEvents: 'none' }} ref={ref}>
        <Portal container={document.body}>
          <Box
            style={{
              left: x + (rect?.left || 0) + window.scrollX,
              top: y + (rect?.top || 0) + window.scrollY,
            }}
            sx={{
              position: 'absolute',
              transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
              zIndex: theme.zIndex.tooltip,
              visibility: ref.current ? 'visible' : 'hidden',
            }}>
            <Box
              sx={{
                borderRadius: 1,
                boxShadow: 3,
                bgcolor: '#FFFFFF',
                p: 2,
                pointerEvents: 'none',
                userSelect: 'none',
                ...(placement === 'top' ? { mb: 1 } : { mt: 1 }),
              }}>
              <Grid container alignItems="center" sx={{ mb: 1, flexWrap: 'nowrap' }}>
                <Grid item>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: circleStrokeColor,
                      bgcolor: circleBgColor,
                      borderRadius: '50%',
                      width: 12,
                      height: 12,
                      mr: 1,
                    }}
                  />
                </Grid>
                <Grid item flex={1}>
                  <Typography variant="body2" component="div" sx={{ whiteSpace: 'nowrap' }}>
                    {title || datum.z}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="fieldLabel">{yAxisLabel}</Typography>
              <Typography variant="fieldValue" sx={{ mb: 1 }}>
                <FormattedNumber value={datum.y} />
              </Typography>
              <Typography variant="fieldLabel">{xAxisLabel}</Typography>
              <Typography variant="fieldValue">
                {variant === 'time'
                  ? datum.x.toISOString().split('T')[0]
                  : variant === 'time_years'
                  ? new Date(new Date(datum.x).setFullYear(datum.year)).toISOString().split('T')[0]
                  : datum.x}
              </Typography>
            </Box>
          </Box>
        </Portal>
      </g>
    </>
  )
}

ChartFlyOut.propTypes = {
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  y: PropTypes.number,
  datum: PropTypes.object,
  style: PropTypes.object,
  activePoints: PropTypes.arrayOf(PropTypes.object),
  placement: PropTypes.oneOf(['top', 'bottom']),
}

ChartFlyOut.defaultProps = {
  placement: 'top',
}

export default ChartFlyOut
