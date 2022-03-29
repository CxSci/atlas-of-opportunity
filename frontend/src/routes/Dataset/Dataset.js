import React, { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import CompareBtn from '../../components/Header/CompareBtn'
import Dashboard from '../../components/Dashboard'
import Map from '../../components/Map/'
import SearchInput from '../../components/Header/SearchInput'
import { DATASETS_MAP } from '../../utils/constants'
import { createDataSetSelector } from 'store/modules/dataset'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import { TempContext } from '../../contexts/AppTempContext'

function Dataset() {
  const params = useParams()
  const { datasetId } = params || {}
  const { setDarkTheme } = useContext(TempContext)
  const dataset = useSelector(createDataSetSelector(datasetId))
  const data = dataset?.exploreLayout
  const DataSetComponent = getDatasetComponent(data?.type)
  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = dataset?.title || ''
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
