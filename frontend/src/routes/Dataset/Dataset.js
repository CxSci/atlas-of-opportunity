import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { getSearchList } from '../../store/modules/search'

function Dataset() {
  const dispatch = useDispatch()
  const params = useParams()
  const { datasetId } = params || {}
  const { setDarkTheme } = useContext(TempContext)
  const dataset = useSelector(createDataSetSelector(datasetId))
  const data = dataset?.exploreLayout
  const DataSetComponent = getDatasetComponent(data?.type)
  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = dataset?.title || ''
  const searchPlaceholder = datasetConfig?.searchPlaceholder || ''

  const [selectedSearchResult, setSelectedSearchResult] = useState(null)

  const handleSearchChange = useCallback(e => {
    dispatch(getSearchList({ datasetId: 'small-business', params: { q: e?.target?.value } }))
  }, [])

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
              <SearchInput placeholder={searchPlaceholder} onChange={handleSearchChange} />

              <CompareBtn />
            </>
          ),
        },
      }}>
      <div>
        <DataSetComponent config={data} datasetId={datasetId} selectedSearchResult={selectedSearchResult} />
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
