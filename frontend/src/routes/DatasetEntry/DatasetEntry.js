import { Box, Typography, ThemeProvider } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import Skeleton from '@mui/material/Skeleton'

import {
  getDatasetDetailData,
  getDatasetGeoJSON,
  datasetDetailDataSelector,
  createDataSetSelector,
} from 'store/modules/dataset'
import { setApiData } from 'store/modules/api'
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
import useCompareList from 'hooks/useCompareList'

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
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { datasetId, entryId } = params || {}
  const DatasetEntryComponent = getDatasetEntryComponent(datasetId)
  const {
    comparisonList,
    addToComparison,
    removeFromComparison,
    canAddToComparison,
    setCompareListOpen,
    setGeoJsonMap,
    geoJsonMap,
    compareListOpen,
  } = useCompareList(datasetId)

  const dataset = useSelector(createDataSetSelector(datasetId))
  const sectionsData = useSelector(datasetDetailDataSelector)
  const [datasetGeoJSON, setDatasetGeoJSON] = useState(null)

  const sectionsLayout = dataset?.detailLayout
  const datasetName = dataset?.title || ''
  const datasetRoute = PATH.DATASET.replace(':datasetId', datasetId)
  const entryName = sectionsData?._atlas_title
  const theme = useMemo(() => initTheme(sectionsLayout?.theme), [sectionsLayout?.theme])
  const disableAddToComparison = !canAddToComparison(entryId)

  const handleAddToComparison = useCallback(() => {
    addToComparison({
      id: entryId,
      title: sectionsData?._atlas_title,
    })
  }, [addToComparison, entryId, sectionsData?._atlas_title])

  const onSelectCompareItem = useCallback(
    item => {
      navigate(`${datasetRoute}/${item?.id}`)
    },
    [datasetRoute, navigate],
  )

  useEffect(() => {
    dispatch(
      getDatasetDetailData({
        datasetId,
        entryId,
      }),
    )
    return dispatch(setApiData({ selectorKey: 'datasetDetailData', data: null }))
  }, [dispatch, datasetId, entryId])

  useEffect(() => {
    dispatch(
      getDatasetGeoJSON({
        datasetId,
        params: {
          ids: entryId,
          include_neighbors: true,
          format: 'json',
        },
        success: geoJson => {
          setDatasetGeoJSON(geoJson)
        },
      }),
    )
    return dispatch(setApiData({ selectorKey: 'datasetGeoJSON', data: null }))
  }, [dispatch, datasetId, entryId])

  const headerRightContent = (
    <>
      <CompareAddBtn onClick={handleAddToComparison} disabled={disableAddToComparison} />

      <CompareBtn
        comparisonList={comparisonList}
        removeFromComparison={removeFromComparison}
        onSelect={onSelectCompareItem}
        setCompareListOpen={setCompareListOpen}
        geoJsonMap={geoJsonMap}
        setGeoJsonMap={setGeoJsonMap}
        compareListOpen={compareListOpen}
        datasetId={datasetId}
      />
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
                {datasetGeoJSON ? (
                  <Box sx={{ width: 64 }}>
                    <StaticMap square areaId={entryId} geoJSON={datasetGeoJSON} />
                  </Box>
                ) : (
                  <Skeleton variant="rectangular" width={64} height={64} />
                )}
                {entryName ? <Typography>{entryName}</Typography> : <Skeleton variant="text" width={100} />}
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
