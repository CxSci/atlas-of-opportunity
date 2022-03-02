import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import PropTypes from 'prop-types'

const nonDomPropsList = ['colorScheme']
const GradientProgress = styled(LinearProgress, { shouldForwardProp: name => !nonDomPropsList.includes(name) })(
  ({ theme, value, colorScheme }) => ({
    [`& .${linearProgressClasses.bar}`]: {
      overflow: 'hidden',
      backgroundColor: 'transparent',
      borderRadius: 1,
      '&:before': {
        content: '""',
        display: 'block',
        width: '100%',
        height: '100%',
        borderRadius: theme.shape.borderRadius,
        transition: 'transform .4s linear',
        transform: `translateX(${100 - value}%)`,
        background: `linear-gradient(270deg, ${colorScheme?.[0] || theme.palette.canary.main} 0%, ${
          colorScheme?.[1] || theme.palette.chestnutRose.main
        } 50%, ${colorScheme?.[2] || theme.palette.ultramarine.main} 100%)`, // eslint-disable-line
      },
    },
  }),
)

const SimpleRange = ({ min, max, value, style, color, colorScheme }) => {
  const Range = style === 'gradient' ? GradientProgress : LinearProgress
  const percentage = Math.min(1, (value - min) / (max - min || 1))
  return (
    <Range
      value={percentage * 100}
      sx={{
        height: 24,
        borderRadius: 1,
        [`& .${linearProgressClasses.bar}`]: { borderRadius: 1 },
        WebkitMaskImage: '-webkit-radial-gradient(white, black)', // fixes border-radius on safari
      }}
      variant="determinate"
      color={color}
      colorScheme={colorScheme}
    />
  )
}

SimpleRange.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'error', 'warning']),
  style: PropTypes.oneOf(['solid', 'gradient']),
  colorScheme: PropTypes.array,
}

SimpleRange.defaultProps = {
  style: 'solid',
  color: 'primary',
  min: 0,
  max: 1,
}

export default SimpleRange
