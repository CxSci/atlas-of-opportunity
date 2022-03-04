import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import PropTypes from 'prop-types'

function generateGradientString({ colorScheme = [], colorSchemeDomain = [] }) {
  const maxValue = colorSchemeDomain?.[colorSchemeDomain?.length - 1] ?? 1
  return colorScheme.reduce((str, color, index) => {
    const percentage = Math.round((colorSchemeDomain?.[index] / maxValue) * 100)
    return str + `${index > 0 ? ', ' : ''} ${color} ${percentage}%`
  }, '')
}

const nonDomPropsList = ['colorScheme', 'colorSchemeDomain']
const GradientProgress = styled(LinearProgress, { shouldForwardProp: name => !nonDomPropsList.includes(name) })(
  ({ theme, value, colorScheme, colorSchemeDomain }) => ({
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
        background: `linear-gradient(90deg, ${generateGradientString({ colorScheme, colorSchemeDomain })})`, // eslint-disable-line
      },
    },
  }),
)

const SimpleRange = ({
  min,
  max,
  value,
  style,
  color,
  colorScheme,
  colorSchemeDomain,
  size,
  sx = {},
  ...otherProps
}) => {
  const Range = style === 'gradient' ? GradientProgress : LinearProgress
  const percentage = Math.min(1, (value - min) / (max - min || 1))
  const height = size === 'small' ? 14 : 24
  return (
    <Range
      value={percentage * 100}
      sx={{
        height,
        borderRadius: 1,
        [`& .${linearProgressClasses.bar}`]: { borderRadius: 1 },
        WebkitMaskImage: '-webkit-radial-gradient(white, black)', // fixes border-radius on safari
        ...sx,
      }}
      variant="determinate"
      color={color}
      colorScheme={colorScheme}
      colorSchemeDomain={colorSchemeDomain}
      {...otherProps}
    />
  )
}

SimpleRange.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  sx: PropTypes.object,
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'error', 'warning']),
  style: PropTypes.oneOf(['solid', 'gradient']),
  size: PropTypes.oneOf(['small', 'medium']),
  colorScheme: PropTypes.array,
  colorSchemeDomain: PropTypes.array,
}

SimpleRange.defaultProps = {
  style: 'solid',
  size: 'medium',
  color: 'primary',
  min: 0,
  max: 1,
}

export default SimpleRange
