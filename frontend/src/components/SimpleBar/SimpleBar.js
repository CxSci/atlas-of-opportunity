import { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import PropTypes from 'prop-types'

import { NumberFormatType } from 'utils/propTypes'
import FieldNumber from 'components/FieldNumber'

const SimpleBar = ({ value, percentage, numberFormat }) => {
  const containerRef = useRef(null)
  const fieldRef = useRef(null)
  const [fullWidth, setFullWidth] = useState(containerRef.current?.clientWidth)
  const fieldWidth = fieldRef.current?.clientWidth
  const handleContainerResize = useCallback(() => setFullWidth(containerRef.current?.clientWidth), [setFullWidth])
  const getContainerNode = useCallback(
    node => {
      if (node) {
        containerRef.current = node
        handleContainerResize()
      }
    },
    [handleContainerResize],
  )
  const getFieldNode = useCallback(node => {
    if (node) {
      fieldRef.current = node
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleContainerResize)
    return () => window.removeEventListener('resize', handleContainerResize)
  }, [handleContainerResize])

  const width = useMemo(
    () => Math.max((fullWidth - fieldWidth - 8) * percentage, 8),
    [fullWidth, fieldWidth, percentage],
  )

  return (
    <Box ref={getContainerNode}>
      <Grid container spacing={1} alignItems="center" flexWrap="nowrap">
        <Grid item flex={1}>
          <Box sx={{ position: 'relative', width }}>
            <LinearProgress
              value={100}
              sx={{ height: 24, borderRadius: 1, [`& .${linearProgressClasses.bar}`]: { borderRadius: 1 } }}
              variant="determinate"
              color="secondary"
            />
            <Box
              ref={getFieldNode}
              sx={{ position: 'absolute', left: '100%', top: '50%', ml: 1, transform: 'translateY(-50%)' }}>
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
