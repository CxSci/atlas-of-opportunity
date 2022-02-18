import React from 'react'
import { useParams } from 'react-router'

import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import { DATASETS_MAP } from '../../utils/constants'
import PATH from '../../utils/path'

function DatasetCompare() {
  const params = useParams()
  const { datasetId } = params || {}

  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = datasetConfig?.name || ''
  const datasetRoute = PATH.DATASET.replace(':datasetId', datasetId)

  return (
    <Dashboard
      headerConfig={{
        content: {
          left: (
            <AtlasBreadcrumbs
              links={[homeBreadcrumbLink, { text: datasetName, path: datasetRoute }, { text: 'Comparison' }]}
            />
          ),
        },
      }}>
      <div>DATASET COMPARE page</div>
    </Dashboard>
  )
}

export default DatasetCompare
