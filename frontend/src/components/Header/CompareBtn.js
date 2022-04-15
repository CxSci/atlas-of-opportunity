import React from 'react'
import CompareIcon from '../Icons/CompareIcon'
import { Button, Typography } from '@mui/material'
import ComparisonMenu from '../ComparisonMenu'

function CompareBtn({
  comparisonList,
  removeFromComparison,
  setGeoJsonMap,
  geoJsonMap,
  onHighlightChange = () => null,
  onSelect = () => null,
  compareListOpen,
  setCompareListOpen,
  datasetId,
  ...props
}) {
  const toggleCompareMenuOpen = () => setCompareListOpen(compareListOpen => !compareListOpen)

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
        open={compareListOpen}
        setOpen={setCompareListOpen}
        comparisonList={comparisonList}
        removeFromComparison={removeFromComparison}
        onSelect={onSelect}
        onHighlightChange={onHighlightChange}
        setGeoJsonMap={setGeoJsonMap}
        geoJsonMap={geoJsonMap}
        datasetId={datasetId}
      />
    </>
  )
}

export default CompareBtn
