import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'
import { extent as d3Extent } from 'd3-array'
import PropTypes from 'prop-types'

function generateGradientString({ colorScheme = [], domain = [] }) {
  const scale = d3ScaleLinear().domain(d3Extent(domain)).range([0, 100]).clamp(true)
  return domain.reduce((str, value, index) => {
    const color = colorScheme[index]
    return str + `${index > 0 ? ', ' : ''} ${color} ${scale(value)}%`
  }, '')
}

const nonDomPropsList = ['colorScheme', 'domain']
const GradientProgress = styled(LinearProgress, { shouldForwardProp: name => !nonDomPropsList.includes(name) })(
  ({ theme, value, colorScheme, domain }) => ({
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
        background: `linear-gradient(90deg, ${generateGradientString({ colorScheme, domain })})`, // eslint-disable-line
      },
    },
  }),
)

const SimpleRange = ({ value, variant, color, colorScheme, domain, size, sx = {}, ...otherProps }) => {
  const Range = variant === 'gradient' ? GradientProgress : LinearProgress
  const scale = d3ScaleLinear().domain(d3Extent(domain)).range([0, 100]).clamp(true)
  const percentage = scale(value)
  const height = size === 'small' ? 14 : 24
  const gradientProps =
    variant === 'gradient'
      ? {
          colorScheme,
          domain,
        }
      : {}

  return (
    <Range
      value={percentage}
      sx={{
        height,
        borderRadius: 1,
        [`& .${linearProgressClasses.bar}`]: { borderRadius: 1 },
        WebkitMaskImage: '-webkit-radial-gradient(white, black)', // fixes border-radius on safari
        ...sx,
      }}
      variant="determinate"
      color={color}
      {...gradientProps}
      {...otherProps}
    />
  )
}

SimpleRange.propTypes = {
  value: PropTypes.number.isRequired,
  domain: PropTypes.array,
  sx: PropTypes.object,
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'error', 'warning']),
  variant: PropTypes.oneOf(['solid', 'gradient']),
  size: PropTypes.oneOf(['small', 'medium']),
  colorScheme: PropTypes.array,
}

SimpleRange.defaultProps = {
  variant: 'solid',
  size: 'medium',
  color: 'primary',
  domain: [0, 1],
}

export default SimpleRange
