import React from 'react'
import { Button, Typography } from '@mui/material'
import CompareIcon from '../Icons/CompareIcon'

function CompareBtn(props) {
  return (
    <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }} {...props}>
      <CompareIcon />

      <Typography component={'span'} sx={{ ml: 1 }}>
        Compare
      </Typography>
    </Button>
  )
}

export default CompareBtn
