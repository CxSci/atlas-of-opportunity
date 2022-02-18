import React from 'react'
import CompareIcon from '../Icons/CompareIcon'
import { Box, Button } from '@mui/material'

function CompareBtn(props) {
  return (
    <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }} {...props}>
      <CompareIcon />

      <Box component={'span'} ml={1}>
        Compare
      </Box>
    </Button>
  )
}

export default CompareBtn
