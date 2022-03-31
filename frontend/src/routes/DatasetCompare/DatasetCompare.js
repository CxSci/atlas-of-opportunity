import React from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { Box, Grid, Typography } from '@mui/material'

import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import PATH from '../../utils/path'
import { createDataSetSelector } from 'store/modules/dataset'

function DatasetCompare() {
  const params = useParams()
  const { datasetId } = params || {}

  const dataset = useSelector(createDataSetSelector(datasetId))
  const datasetName = dataset?.title || ''
  const datasetRoute = PATH.DATASET.replace(':datasetId', datasetId)

  const compareList = [
    {
      id: 'Receptionists',
      name: 'Receptionists',
    },
    {
      id: 'Midwives',
      name: 'Midwives',
    },
    {
      id: 'Air Conditioning and Refrigeration Mechanics',
      name: 'Air Conditioning and Refrigeration Mechanics',
    },
  ]
  const compareListWithMinimap = [
    {
      id: 'Receptionists',
      name: 'Receptionists',
      hasMinimap: true,
    },
    {
      id: 'Midwives',
      name: 'Midwives',
      hasMinimap: true,
    },
    {
      id: 'Air Conditioning',
      name: 'Air Conditioning',
      hasMinimap: true,
    },
    {
      id: 'Air Conditioning and Refrigeration Mechanics',
      name: 'Air Conditioning and Refrigeration Mechanics',
      hasMinimap: true,
    },
  ]

  return (
    <Dashboard
      headerConfig={{
        leftContainerProps: { width: '100%' },
        customScrolledHeight: '100px',
        content: {
          left: (
            <AtlasBreadcrumbs
              links={[homeBreadcrumbLink, { text: datasetName, path: datasetRoute }, { text: 'Comparison' }]}
            />
          ),
        },
        contentScrolled: {
          left: (
            <Grid container spacing={2}>
              {compareListWithMinimap.map((compareItem, index, array) => {
                const headerColSize = Math.max(12 / array.length, 3)

                return (
                  <Grid key={compareItem.id} item xs={headerColSize} sx={{ display: 'flex', alignItems: 'center' }}>
                    {compareItem?.hasMinimap && (
                      <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        bgcolor={theme => theme.palette.secondary.main}
                        width={64}
                        height={64}
                        fontSize={12}
                        mr={1.25}
                        p={0.5}>
                        Minimap
                      </Box>
                    )}

                    <Typography>{compareItem?.name}</Typography>
                  </Grid>
                )
              })}
            </Grid>
          ),
        },
      }}>
      <div style={{ height: '120vh' }}>DATASET COMPARE page</div>
    </Dashboard>
  )
}

export default DatasetCompare
