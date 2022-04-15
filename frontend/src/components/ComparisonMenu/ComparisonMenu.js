import React, { Fragment, useCallback, useRef } from 'react'
import { Box, Button, Divider, IconButton, List, ListItem, Typography } from '@mui/material'
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
    <List ref={containerRef} variant={'comparisonMenu'}>
      <li>
        <Typography fontSize={14} align={'center'} px={3} py={2.25}>
          Add up to 4 regions to compare them side-by-side.
        </Typography>
      </li>

      {comparisonList.map(item => (
        <Fragment key={item?.id}>
          <li>
            <Divider />
          </li>

          <ListItem
            variant={'comparisonMenuItem'}
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
          </ListItem>
        </Fragment>
      ))}

      <li>
        <Divider />
      </li>

      <ListItem sx={{ px: 3, py: 2 }}>
        <Button
          variant={'contained'}
          color={'primary'}
          sx={{ height: '42px', color: '#fff', borderRadius: '24px', display: 'block', width: '100%', fontWeight: 700 }}
          disabled={!comparisonList?.length}>
          View Comparison
        </Button>
      </ListItem>
    </List>
  )
}

export default ComparisonMenu
