import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import { FormattedNumber } from 'react-intl'

const SimpleBar = ({ value }) => {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item sx={{ width: `${value}%` }}>
        <LinearProgress value={100} sx={{ height: 24, borderRadius: 1 }} variant="determinate" color="secondary" />
      </Grid>
      <Grid item xs="auto">
        <Typography variant="fieldValue">
          <FormattedNumber value={value / 100} style="percent" />
        </Typography>
      </Grid>
    </Grid>
  )
}

export default SimpleBar
