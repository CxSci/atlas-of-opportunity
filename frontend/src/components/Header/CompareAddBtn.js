import React from 'react'
import { Button, Typography } from '@mui/material'
import CompareIconPlus from '../Icons/CompareIconPlus'

function CompareAddBtn(props) {
  return (
    <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }} {...props}>
      <CompareIconPlus />

      <Typography component={'span'} sx={{ ml: 1 }}>
        Add to comparison
      </Typography>
    </Button>
  )
}

export default CompareAddBtn
