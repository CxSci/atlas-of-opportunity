import { useParams } from 'react-router'
import { Box, Typography } from '@mui/material'

import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import CompareBtn from '../../components/Header/CompareBtn'
import { DATASETS_MAP } from '../../utils/constants'
import CompareAddBtn from '../../components/Header/CompareAddBtn'
import PATH from '../../utils/path'
import SmallBusinessSupport from 'routes/SmallBusinessSupport'

const getDatasetComponent = datasetId => {
  switch (datasetId) {
    case 'small-business-support':
      return SmallBusinessSupport
    default:
      return SmallBusinessSupport
  }
}

const DatasetEntry = () => {
  const params = useParams()
  const { datasetId, entryId } = params || {}
  const DataSetComponent = getDatasetComponent(datasetId)

  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = datasetConfig?.name || ''
  const datasetRoute = PATH.DATASET.replace(':datasetId', datasetId)
  const entry = datasetConfig?.entriesMap?.[entryId]
  const entryName = entry?.name || ''

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
        content: {
          left: (
            <AtlasBreadcrumbs
              links={[homeBreadcrumbLink, { text: datasetName, path: datasetRoute }, { text: entryName }]}
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
      <DataSetComponent />
    </Dashboard>
  )
}

export default DatasetEntry
