import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'

import Dashboard from '../../components/Dashboard'
import { DATASETS_MAP } from '../../utils/constants'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import SearchInput from '../../components/Header/SearchInput'
import CompareBtn from '../../components/Header/CompareBtn'
import { TempContext } from '../../contexts/AppTempContext'
import Map from '../../components/Map/'
import smallBusinessSupportData from 'mocked_api_responses/explore_layout_small_business_support.json'

function Dataset() {
  const params = useParams()
  const { datasetId } = params || {}
  // TODO: temp
  const { setDarkTheme } = useContext(TempContext)
  const [data, setData] = useState(smallBusinessSupportData)
  const DataSetComponent = getDatasetComponent(data?.type)
  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = data?.title || ''
  const searchPlaceholder = datasetConfig?.searchPlaceholder || ''

  // effects
  useEffect(() => {
    setDarkTheme(datasetConfig?.darkTheme)

    // reset dark theme value
    return () => setDarkTheme(false)
  }, [datasetConfig?.darkTheme, setDarkTheme])

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
      <div>
        <DataSetComponent config={data} />
      </div>
    </Dashboard>
  )
}

function getDatasetComponent(datasetId) {
  switch (datasetId) {
    case 'map':
      return Map
    default:
      return () => null
  }
}

export default Dataset
