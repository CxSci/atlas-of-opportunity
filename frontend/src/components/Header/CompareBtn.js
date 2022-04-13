import React from 'react'
import CompareIcon from '../Icons/CompareIcon'
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import ComparisonMenu from '../ComparisonMenu'
import { setCompareMenuOpen } from '../../store/modules/compare'

function CompareBtn({
  comparisonList,
  removeFromComparison,
  onHighlightChange = () => null,
  onSelect = () => null,
  ...props
}) {
  const dispatch = useDispatch()
  const compareMenuOpen = useSelector(state => state.compare?.menuOpen)
  const toggleCompareMenuOpen = () => dispatch(setCompareMenuOpen(!compareMenuOpen))

  return (
    <>
      <Button
        variant="contained"
        color={'primary'}
        sx={{ color: '#fff', ml: 2 }}
        onClick={toggleCompareMenuOpen}
        {...props}>
        <CompareIcon />

        <Typography component={'span'} fontWeight={700} sx={{ ml: 1 }}>
          Compare {comparisonList?.length > 0 ? comparisonList.length : ''}
        </Typography>
      </Button>

      <ComparisonMenu
        comparisonList={comparisonList}
        removeFromComparison={removeFromComparison}
        onSelect={onSelect}
        onHighlightChange={onHighlightChange}
      />
    </>
  )
}

export default CompareBtn
