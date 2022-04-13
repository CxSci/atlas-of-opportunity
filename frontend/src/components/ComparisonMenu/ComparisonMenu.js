import React, { Fragment, useCallback, useRef } from 'react'
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { setCompareMenuOpen } from '../../store/modules/compare'
import useOutsideClick from '../../hooks/useOutsideClick'
import StaticMap from '../StaticMap'

function ComparisonMenu({ comparisonList, removeFromComparison, onHighlightChange, onSelect }) {
  const dispatch = useDispatch()
  const containerRef = useRef()
  const compareMenuOpen = useSelector(state => state.compare?.menuOpen)
  const closeCompareMenuOpen = useCallback(() => dispatch(setCompareMenuOpen(false)), [dispatch])

  useOutsideClick(containerRef, closeCompareMenuOpen)

  const handleDeleteClick = useCallback(
    (e, id) => {
      e.stopPropagation()
      removeFromComparison(id)
    },
    [removeFromComparison],
  )

  if (!compareMenuOpen) {
    return null
  }

  return (
    <Box
      ref={containerRef}
      component={Stack}
      position={'absolute'}
      right={theme => theme.components.header.paddingX}
      top={'calc(100% + 4px)'}
      width={theme => theme.components.comparisonMenu.width}
      bgcolor={theme => theme.components.comparisonMenu.bgColor}
      boxShadow={theme => theme.components.comparisonMenu.boxShadow}
      borderRadius={theme => theme.components.comparisonMenu.borderRadius}>
      <Typography fontSize={14} align={'center'} px={3} py={2.25}>
        Add up to 4 regions to compare them side-by-side.
      </Typography>

      {comparisonList.map(item => (
        <Fragment key={item?.id}>
          <Divider />

          <Box
            component={Button}
            variant={'text'}
            color={'initial'}
            display={'flex'}
            alignItems={'center'}
            p={1}
            onClick={() => onSelect(item)}
            onMouseEnter={() => onHighlightChange(item)}
            onMouseLeave={() => onHighlightChange(null)}>
            <Box sx={{ width: 64 }}>
              <StaticMap square areaId={item?.id} geoJSON={item} />
            </Box>

            <Typography component={'span'} ml={2}>
              {item?.title}
            </Typography>

            <IconButton
              onClick={e => handleDeleteClick(e, item?.id)}
              sx={{
                ml: 'auto',
              }}>
              <Delete sx={{ color: '#666' }} />
            </IconButton>
          </Box>
        </Fragment>
      ))}

      <Divider />

      <Box px={3} py={2}>
        <Button
          variant={'contained'}
          color={'primary'}
          sx={{ height: '42px', color: '#fff', borderRadius: '24px', display: 'block', width: '100%', fontWeight: 700 }}
          disabled={!comparisonList?.length}>
          View Comparison
        </Button>
      </Box>
    </Box>
  )
}

export default ComparisonMenu
