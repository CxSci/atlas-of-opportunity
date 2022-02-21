import Typography from '@mui/material/Typography'
import { FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'
import { NumberFormatType } from 'utils/propTypes'

const FieldNumber = ({ value, numberFormat, gutterBottom }) => (
  <Typography variant="fieldValue" gutterBottom={gutterBottom}>
    <FormattedNumber value={value} {...numberFormat} />
  </Typography>
)

FieldNumber.propTypes = {
  value: PropTypes.number.isRequired,
  numberFormat: NumberFormatType,
  gutterBottom: PropTypes.bool,
}

export default FieldNumber
