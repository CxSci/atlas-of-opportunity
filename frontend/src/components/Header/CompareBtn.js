import React from 'react'
import { Button, Typography } from '@mui/material'
import CompareIcon from '../Icons/CompareIcon'
import ComparisonMenu from '../ComparisonMenu'

function CompareBtn({ comparisonList, removeFromComparison, ...props }) {
  return (
    <>
      <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }} {...props}>
        <CompareIcon />

        <Typography component={'span'} fontWeight={700} sx={{ ml: 1 }}>
          Compare {comparisonList?.length > 0 ? comparisonList.length : ''}
        </Typography>
      </Button>

      <ComparisonMenu comparisonList={comparisonList} removeFromComparison={removeFromComparison} />
    </>
  )
}

export default CompareBtn
