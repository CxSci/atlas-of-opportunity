import React, { Fragment, useCallback, useEffect } from 'react'
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItem,
  Popper,
  Skeleton,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/system'
import { Delete } from '@mui/icons-material'
import { useDispatch } from 'react-redux'
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
  compareBtnRef,
}) {
  const dispatch = useDispatch()
  const theme = useTheme()
  const closeCompareMenuOpen = useCallback(() => setOpen(false), [setOpen])

  const handleDeleteClick = useCallback(
    (e, id) => {
      e.stopPropagation()
      removeFromComparison(id)
    },
    [removeFromComparison],
  )

  useEffect(() => {
    const itemIdsList = comparisonList.map(item => item?.id)

    itemIdsList.forEach(id => {
      dispatch(
        getDatasetGeoJSON({
          datasetId,
          params: {
            ids: id,
            include_neighbors: true,
            format: 'json',
          },
          success: geoJson => {
            if (!geoJson) {
              return
            }

            setGeoJsonMap(geoJsonMap => ({ ...geoJsonMap, [id]: geoJson }))
          },
        }),
      )
    })
  }, [comparisonList, datasetId, dispatch, setGeoJsonMap])

  return (
    <Popper
      style={{ zIndex: theme?.zIndex?.modal }}
      open={open}
      anchorEl={compareBtnRef?.current}
      placement={'bottom-end'}
      popperOptions={{ strategy: 'fixed' }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 15],
          },
        },
      ]}>
      <ClickAwayListener onClickAway={closeCompareMenuOpen}>
        <List variant={'comparisonMenu'}>
          <li>
            <Typography fontSize={14} align={'center'} px={3} py={2.25}>
              Add up to 4 regions to compare them side-by-side.
            </Typography>
          </li>

          {comparisonList.map(item => {
            const geoJson = geoJsonMap[item?.id]
            const itemWithBbox = { ...(item || {}), bbox: geoJson?.bbox }

            return (
              <Fragment key={item?.id}>
                <li>
                  <Divider />
                </li>

                <ListItem
                  variant={'comparisonMenuItem'}
                  onClick={() => onSelect(itemWithBbox)}
                  onMouseEnter={() => onHighlightChange(itemWithBbox)}
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
              sx={{
                height: '42px',
                color: '#fff',
                borderRadius: '24px',
                display: 'block',
                width: '100%',
                fontWeight: 700,
              }}
              disabled={!comparisonList?.length}>
              View Comparison
            </Button>
          </ListItem>
        </List>
      </ClickAwayListener>
    </Popper>
  )
}

export default ComparisonMenu
