import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import { Box, Button, Divider, IconButton, List, ListItem, Skeleton, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import useOutsideClick from 'hooks/useOutsideClick'
import StaticMap from '../StaticMap'
import { getDatasetGeoJSON } from 'store/modules/dataset'

function ComparisonMenu({
  comparisonList,
  removeFromComparison,
  onHighlightChange,
  datasetId,
  onSelect,
  setGeoJsonMap,
  geoJsonMap,
  open,
  setOpen,
}) {
  const dispatch = useDispatch()
  const containerRef = useRef()
  const closeCompareMenuOpen = useCallback(() => setOpen(false), [setOpen])

  useOutsideClick(containerRef, closeCompareMenuOpen)

  const handleDeleteClick = useCallback(
    (e, id) => {
      e.stopPropagation()
      removeFromComparison(id)
    },
    [removeFromComparison],
  )

  useEffect(() => {
    const itemIdsList = comparisonList.map(item => item?.id)
    const dataMap = {}

    function fetchGeoJsonRecursively() {
      const id = itemIdsList.pop()
      if (!id) {
        return
      }

      dispatch(
        getDatasetGeoJSON({
          datasetId,
          noSetToStore: true,
          params: {
            ids: id,
            include_neighbors: true,
            format: 'json',
          },
          success: geoJson => {
            dataMap[id] = geoJson

            if (!itemIdsList.length) {
              setGeoJsonMap(dataMap)
              return
            }

            fetchGeoJsonRecursively()
          },
        }),
      )
    }

    fetchGeoJsonRecursively()
  }, [comparisonList, datasetId, dispatch, setGeoJsonMap])

  if (!open) {
    return null
  }

  return (
    <List ref={containerRef} variant={'comparisonMenu'}>
      <li>
        <Typography fontSize={14} align={'center'} px={3} py={2.25}>
          Add up to 4 regions to compare them side-by-side.
        </Typography>
      </li>

      {comparisonList.map(item => {
        const geoJson = geoJsonMap[item?.id]

        return (
          <Fragment key={item?.id}>
            <li>
              <Divider />
            </li>

            <ListItem
              variant={'comparisonMenuItem'}
              onClick={() => onSelect(item)}
              onMouseEnter={() => onHighlightChange(item)}
              onMouseLeave={() => onHighlightChange(null)}>
              <Box sx={{ width: 64, minWidth: 64 }}>
                {geoJson ? (
                  <StaticMap square areaId={item?.id} geoJSON={geoJson} />
                ) : (
                  <Skeleton variant="rectangular" width={64} height={64} />
                )}
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
        )
      })}

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
