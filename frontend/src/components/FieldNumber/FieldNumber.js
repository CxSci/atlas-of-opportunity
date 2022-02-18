import Typography from '@mui/material/Typography'
import { FormattedNumber } from 'react-intl'

const FieldNumber = ({ value, numberFormat, gutterBottom }) => (
  <Typography variant="fieldValue" gutterBottom={gutterBottom}>
    <FormattedNumber value={value} {...numberFormat} />
  </Typography>
)

export default FieldNumber
