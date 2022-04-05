import React, { useMemo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { ThemeProvider } from '@mui/material'

import AtlasBreadcrumbs from 'components/AtlasBreadcrumbs'
import CompareBtn from 'components/Header/CompareBtn'
import Dashboard from 'components/Dashboard'
import Map from 'components/Map/'
import SearchInput from 'components/Header/SearchInput'
import { createDataSetSelector } from 'store/modules/dataset'
import { getSearchList } from 'store/modules/search'
import { homeBreadcrumbLink } from 'components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import initTheme from 'utils/theme'

function Dataset() {
  const dispatch = useDispatch()
  const params = useParams()
  const { datasetId } = params || {}
  const dataset = useSelector(createDataSetSelector(datasetId))
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [highlightedFeature, setHighlightedFeature] = useState(null)

  const data = dataset?.exploreLayout
  const DataSetComponent = getDatasetComponent(data?.type)
  const datasetName = dataset?.title || ''
  const searchPlaceholder = data?.searchPlaceholder || ''
  const theme = useMemo(() => initTheme(data?.theme), [data?.theme])

  const handleSearchChange = useCallback(
    e => {
      dispatch(getSearchList({ datasetId, params: { q: e?.target?.value } }))
    },
    [dispatch, datasetId],
  )

  return (
    <ThemeProvider theme={theme}>
      <Dashboard
        headerConfig={{
          searchPlaceholder,
          content: {
            left: <AtlasBreadcrumbs links={[homeBreadcrumbLink, { text: datasetName }]} />,
            right: (
              <>
                <SearchInput
                  placeholder={searchPlaceholder}
                  onChange={handleSearchChange}
                  onSelect={setSelectedFeature}
                  onHighlightChange={setHighlightedFeature}
                />

                <CompareBtn />
              </>
            ),
          },
        }}>
        <div>
          <DataSetComponent
            config={data}
            datasetId={datasetId}
            selectedFeature={selectedFeature}
            highlightedFeature={highlightedFeature}
          />
        </div>
      </Dashboard>
    </ThemeProvider>
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
