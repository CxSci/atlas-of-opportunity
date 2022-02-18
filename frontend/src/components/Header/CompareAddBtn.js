import React from 'react'
import CompareIconPlus from '../Icons/CompareIconPlus'
import { Box, Button } from '@mui/material'

function CompareAddBtn(props) {
  return (
    <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }} {...props}>
      <CompareIconPlus />

      <Box component={'span'} ml={1}>
        Add to comparison
      </Box>
    </Button>
  )
}

export default CompareAddBtn
