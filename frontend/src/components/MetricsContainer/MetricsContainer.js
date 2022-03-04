import { Fragment } from 'react'
import Grid from '@mui/material/Grid'
import PropTypes from 'prop-types'

import { getColumns } from './MetricsContainer.utils'

const MetricsContainer = ({ metrics, children }) => {
  const columns = getColumns(metrics)
  return (
    <Grid container spacing={4} columns={columns.length}>
      {columns.map(column => {
        const colMetrics = metrics.filter(metric => metric.column === column)
        return (
          <Grid key={column} item md={1} xs={columns.length}>
            {colMetrics.map((metric, index) => (
              <Fragment key={index}>{children(metric)}</Fragment>
            ))}
          </Grid>
        )
      })}
    </Grid>
  )
}

MetricsContainer.propTypes = {
  metrics: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
}

export default MetricsContainer
