import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'

import { DATASETS_MAP } from 'utils/constants'
import { getDatasetDetailData, datasetDetailDataSelector, createDataSetSelector } from 'store/modules/dataset'
import { homeBreadcrumbLink } from 'components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import { scrolledHeaderHeight } from 'utils/theme'
import AtlasBreadcrumbs from 'components/AtlasBreadcrumbs'
import CompareAddBtn from 'components/Header/CompareAddBtn'
import CompareBtn from 'components/Header/CompareBtn'
import Dashboard from 'components/Dashboard'
import PATH from 'utils/path'
import SmallBusinessSupport from 'routes/SmallBusinessSupport'

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
  const sectionsLayout = dataset?.detailLayout
  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = dataset?.title || ''
  const datasetRoute = PATH.DATASET.replace(':datasetId', datasetId)
  const entry = datasetConfig?.entriesMap?.[entryId]
  const entryName = entry?.name || ''

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

  const headerRightContent = (
    <>
      <CompareAddBtn onClick={() => console.log(entryId)} />

      <CompareBtn />
    </>
  )

  return (
    <Dashboard
      headerConfig={{
        backRoute: datasetRoute,
        customScrolledHeight: scrolledHeaderHeight,
        content: {
          left: (
            <AtlasBreadcrumbs
              links={[homeBreadcrumbLink, { text: datasetName, path: datasetRoute }, { text: sectionsLayout?.title }]}
            />
          ),
          right: headerRightContent,
        },
        contentScrolled: {
          left: (
            <>
              {entry?.headerScrolledLeftContent && (
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

              <Typography>{entryName}</Typography>
            </>
          ),
        },
      }}>
      <DatasetEntryComponent sectionsData={sectionsData} sectionsLayout={sectionsLayout} />
    </Dashboard>
  )
}

export default DatasetEntry
