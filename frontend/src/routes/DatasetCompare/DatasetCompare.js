import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Box, Grid, Typography, ThemeProvider } from '@mui/material'

import PATH from 'utils/path'
import Anchor from 'components/Anchor'
import AtlasBreadcrumbs from 'components/AtlasBreadcrumbs'
import Dashboard from 'components/Dashboard'
import SectionNavbar from 'components/SectionNavbar'
import StaticMap from 'components/StaticMap'
import Spinner from 'components/Spinner'
import initTheme from 'utils/theme'
import { componentMappings } from 'routes/SmallBusinessSupport/SmallBusinessSupport'
import { homeBreadcrumbLink } from 'components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import { generateSize } from 'components/StaticMap/StaticMap.utils'
import { createDataSetSelector, getDatasetDetailData, getDatasetGeoJSON } from 'store/modules/dataset'
import { slugify } from 'utils/helpers'

const DatasetCompare = () => {
  const ref = useRef(null)
  const params = useParams()
  const dispatch = useDispatch()
  const { datasetId, comparisonEntryIds } = params || {}
  const [entriesData, setEntriesData] = useState({})
  const [entriesGeoJsonMap, setEntriesGeoJsonMap] = useState({})
  const dataset = useSelector(createDataSetSelector(datasetId))
  const sectionsLayout = dataset?.detailLayout
  const entryIds = useMemo(() => comparisonEntryIds.split('+'), [comparisonEntryIds])
  const datasetName = dataset?.title || ''
  const datasetRoute = PATH.DATASET.replace(':datasetId', datasetId)
  const theme = useMemo(() => initTheme(sectionsLayout?.theme), [sectionsLayout?.theme])
  const [size, setSize] = useState(generateSize(ref, true, 290))
  const { width } = size
  const handleResize = useCallback(() => setSize(generateSize(ref, true, 290)), [])

  const getRef = useCallback(
    node => {
      if (node) {
        ref.current = node
        handleResize()
      }
    },
    [handleResize],
  )

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  useEffect(() => {
    entryIds.forEach(id => {
      dispatch(
        getDatasetDetailData({
          datasetId,
          entryId: id,
          success: entryData => {
            if (!entryData) {
              return
            }
            setEntriesData(entriesData => ({ ...entriesData, [id]: entryData }))
          },
        }),
      )
    })
  }, [entryIds, datasetId, dispatch, setEntriesData])

  useEffect(() => {
    entryIds.forEach(id => {
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
            setEntriesGeoJsonMap(entriesGeoJsonMap => ({ ...entriesGeoJsonMap, [id]: geoJson }))
          },
        }),
      )
    })
  }, [entryIds, datasetId, dispatch, setEntriesGeoJsonMap])

  if (!sectionsLayout) {
    return <Spinner />
  }
  const { sections } = sectionsLayout

  return (
    <ThemeProvider theme={theme}>
      <Dashboard
        headerConfig={{
          backRoute: datasetRoute,
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
                {entryIds.map((entryId, index, array) => {
                  const headerColSize = Math.max(12 / array.length, 3)
                  return (
                    <Grid key={entryId} item xs={headerColSize} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 64, p: 0.5 }}>
                        <StaticMap square areaId={entryId} geoJSON={entriesGeoJsonMap[entryId]} />
                      </Box>
                      <Typography>{entriesData[entryId]?._atlas_title}</Typography>
                    </Grid>
                  )
                })}
              </Grid>
            ),
          },
        }}>
        <Box sx={{ mt: 3 }}>
          <Container>
            <Grid spacing={2} container>
              {entryIds.map((entryId, index, array) => {
                const headerColSize = Math.max(12 / array.length, 3)
                return (
                  <Grid key={entryId} item sm={headerColSize}>
                    <Typography sx={{ fontSize: width / 10, display: { sm: 'block', xs: 'none' } }}>
                      <strong>{entriesData[entryId]?._atlas_title}</strong>
                    </Typography>
                  </Grid>
                )
              })}
            </Grid>
            <Grid spacing={2} sx={{ mb: 3 }} container>
              {entryIds.map((entryId, index, array) => {
                const headerColSize = Math.max(12 / array.length, 3)
                return (
                  <Grid ref={getRef} key={entryId} item xs={12} sm={headerColSize}>
                    <Typography sx={{ fontSize: width / 12, display: { sm: 'none' } }}>
                      <strong>{entriesData[entryId]?._atlas_title}</strong>
                    </Typography>
                    <StaticMap height={290} areaId={entryId} geoJSON={entriesGeoJsonMap[entryId]} />
                  </Grid>
                )
              })}
            </Grid>
          </Container>
          <SectionNavbar sections={sections} />
          <Container>
            {sections.map((section, index) => {
              const sectionId = slugify(section.title)
              return (
                <Box key={sectionId} data-scrollspy={sectionId}>
                  <Anchor htmlId={sectionId} />
                  <Typography variant="h5" gutterBottom>
                    <strong>{section.title}</strong>
                  </Typography>
                  <Box>
                    <Grid container spacing={2}>
                      {entryIds.map((entryId, index, array) => {
                        const headerColSize = Math.max(12 / array.length, 3)
                        return (
                          <Grid key={entryId} item xs={12} sm={headerColSize}>
                            {section.metrics.map((metric, idx) => {
                              const SectionComponent = componentMappings[metric.type]
                              return (
                                <Box key={idx} sx={{ mb: 3 }}>
                                  {metric.title && <Typography variant="sectionTitle">{metric.title}</Typography>}
                                  {SectionComponent && (
                                    <SectionComponent
                                      layout={metric}
                                      data={entriesData[entryId] ? entriesData[entryId][metric.key] : null}
                                    />
                                  )}
                                </Box>
                              )
                            })}
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Box>
                </Box>
              )
            })}
          </Container>
        </Box>
      </Dashboard>
    </ThemeProvider>
  )
}

export default DatasetCompare
