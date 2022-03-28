import React, { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import CompareBtn from '../../components/Header/CompareBtn'
import Dashboard from '../../components/Dashboard'
import Map from '../../components/Map/'
import SearchInput from '../../components/Header/SearchInput'
import { DATASETS_MAP } from '../../utils/constants'
import { createExploreLayoutSelector } from 'store/modules/dataset'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import { TempContext } from '../../contexts/AppTempContext'

function Dataset() {
  const params = useParams()
  const { datasetId } = params || {}
  const { setDarkTheme } = useContext(TempContext)
  const data = useSelector(createExploreLayoutSelector(datasetId))
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
