import { FormattedNumber } from 'react-intl'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'
import PropTypes from 'prop-types'

const GradientProgress = styled(LinearProgress)(({ theme, value }) => ({
  [`& .${linearProgressClasses.bar}`]: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    '&:before': {
      content: '""',
      display: 'block',
      width: '100%',
      height: '100%',
      transition: 'transform .4s linear',
      transform: `translateX(${100 - value}%)`,
      background: `linear-gradient(270deg, ${theme.palette.canary.main} 0%, ${theme.palette.chestnutRose.main} 50%, ${theme.palette.ultramarine.main} 100%)`, // eslint-disable-line
    },
  },
}))

const SimpleRange = ({ min, max, value, style, color }) => {
  const Range = style === 'gradient' ? GradientProgress : LinearProgress
  const percentage = Math.min(1, (value - min) / (max - min || 1))
  return (
    <Tooltip title={<FormattedNumber value={value} />} placement="top">
      <Range value={percentage * 100} sx={{ height: 24, borderRadius: 1 }} variant="determinate" color={color} />
    </Tooltip>
  )
}

SimpleRange.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'error', 'warning']),
  style: PropTypes.oneOf(['solid', 'gradient']),
}

SimpleRange.defaultProps = {
  style: 'solid',
  color: 'primary',
  min: 0,
  max: 1,
}

export default SimpleRange
