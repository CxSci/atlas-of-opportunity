import React from 'react'
import { useParams } from 'react-router'

import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import CompareBtn from '../../components/Header/CompareBtn'
import { DATASETS_MAP } from '../../utils/constants'
import CompareAddBtn from '../../components/Header/CompareAddBtn'
import PATH from '../../utils/path'

function DatasetEntry() {
  const params = useParams()
  const { datasetId, entryId } = params || {}

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
      }}>
      <div>DATASET ENTRY page</div>
    </Dashboard>
  )
}

export default DatasetEntry
