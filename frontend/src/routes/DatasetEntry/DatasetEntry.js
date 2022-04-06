import { Box, Typography, ThemeProvider } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'

import {
  getDatasetDetailData,
  getDatasetGeoJSON,
  datasetDetailDataSelector,
  createDataSetSelector,
  datasetGeoJSONSelector,
} from 'store/modules/dataset'
import { homeBreadcrumbLink } from 'components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import { scrolledHeaderHeight } from 'utils/theme'
import AtlasBreadcrumbs from 'components/AtlasBreadcrumbs'
import CompareAddBtn from 'components/Header/CompareAddBtn'
import CompareBtn from 'components/Header/CompareBtn'
import Dashboard from 'components/Dashboard'
import StaticMap from 'components/StaticMap'
import PATH from 'utils/path'
import SmallBusinessSupport from 'routes/SmallBusinessSupport'
import initTheme from 'utils/theme'

const getDatasetEntryComponent = datasetId => {
  switch (datasetId) {
    case 'small-business-support':
      return SmallBusinessSupport
    default:
      return SmallBusinessSupport
  }
}

const DatasetEntry = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const { datasetId, entryId } = params || {}
  const DatasetEntryComponent = getDatasetEntryComponent(datasetId)

  const dataset = useSelector(createDataSetSelector(datasetId))
  const sectionsData = useSelector(datasetDetailDataSelector)
  const datasetGeoJSON = useSelector(datasetGeoJSONSelector)

  const sectionsLayout = dataset?.detailLayout
  const datasetName = dataset?.title || ''
  const datasetRoute = PATH.DATASET.replace(':datasetId', datasetId)
  const entryName = sectionsData?._atlas_title || ''
  const theme = useMemo(() => initTheme(sectionsLayout?.theme), [sectionsLayout?.theme])

  useEffect(
    () =>
      dispatch(
        getDatasetDetailData({
          datasetId,
          entryId,
        }),
      ),
    [dispatch, datasetId, entryId],
  )

  useEffect(() => {
    dispatch(
      getDatasetGeoJSON({
        datasetId,
        params: {
          ids: entryId,
          include_neighbors: true,
          format: 'json',
        },
      }),
    )
  }, [dispatch, datasetId, entryId])

  const headerRightContent = (
    <>
      <CompareAddBtn onClick={() => console.log(entryId)} />

      <CompareBtn />
    </>
  )

  return (
    <ThemeProvider theme={theme}>
      <Dashboard
        headerConfig={{
          backRoute: datasetRoute,
          customScrolledHeight: scrolledHeaderHeight,
          content: {
            left: <AtlasBreadcrumbs links={[homeBreadcrumbLink, { text: datasetName, path: datasetRoute }]} />,
            right: headerRightContent,
          },
          contentScrolled: {
            left: (
              <>
                {sectionsData?._atlas_header_image && (
                  <Box sx={{ width: 64 }}>
                    <StaticMap square areaId={entryId} geoJSON={datasetGeoJSON} />
                  </Box>
                )}
                <Typography>{entryName}</Typography>
              </>
            ),
          },
        }}>
        <DatasetEntryComponent
          sectionsData={sectionsData}
          sectionsLayout={sectionsLayout}
          entryId={entryId}
          geoJSON={datasetGeoJSON}
        />
      </Dashboard>
    </ThemeProvider>
  )
}

export default DatasetEntry
