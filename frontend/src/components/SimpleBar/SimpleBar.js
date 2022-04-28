import { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import PropTypes from 'prop-types'

import { NumberFormatType } from 'utils/propTypes'
import FieldNumber from 'components/FieldNumber'

const SimpleBar = ({ value, percentage, numberFormat }) => {
  const [node, setNode] = useState(null)
  const getNode = useCallback(
    node => {
      if (node) {
        setNode(node)
      }
    },
    [setNode],
  )
  const fullWidth = node?.clientWidth
  const width = useMemo(() => Math.max(fullWidth * percentage, 8), [fullWidth, percentage])

  return (
    <Box ref={getNode}>
      <Grid container spacing={1} alignItems="center" flexWrap="nowrap">
        <Grid item flex={1}>
          <Box sx={{ position: 'relative', width }}>
            <LinearProgress
              value={100}
              sx={{ height: 24, borderRadius: 1, [`& .${linearProgressClasses.bar}`]: { borderRadius: 1 } }}
              variant="determinate"
              color="secondary"
            />
            <Box sx={{ position: 'absolute', left: '100%', top: '50%', ml: 1, transform: 'translateY(-50%)' }}>
              <FieldNumber value={value} numberFormat={numberFormat} />
            </Box>
          </Box>
        </Grid>
        <Grid item sx={{ visibility: 'hidden' }}>
          {/* render again to make it take up space for the number rendered above*/}
          <FieldNumber value={value} numberFormat={numberFormat} />
        </Grid>
      </Grid>
    </Box>
  )
}

SimpleBar.propTypes = {
  value: PropTypes.number.isRequired,
  percentage: PropTypes.number,
  numberFormat: NumberFormatType,
}

export default SimpleBar
