import React from 'react'
import { useParams } from 'react-router'

import Dashboard from '../../components/Dashboard'
import { DATASETS_MAP } from '../../utils/constants'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import SearchInput from '../../components/Header/SearchInput'
import CompareBtn from '../../components/Header/CompareBtn'

function Dataset() {
  const params = useParams()
  const { datasetId } = params || {}

  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = datasetConfig?.name || ''
  const searchPlaceholder = datasetConfig?.searchPlaceholder || ''

  return (
    <Dashboard
      headerConfig={{
        searchPlaceholder,
        content: {
          left: <AtlasBreadcrumbs links={[homeBreadcrumbLink, { text: datasetName }]} />,
          right: (
            <>
              <SearchInput placeholder={searchPlaceholder} />

              <CompareBtn />
            </>
          ),
        },
      }}>
      <div>DATASET page</div>
    </Dashboard>
  )
}

export default Dataset
