import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router'

import Dashboard from '../../components/Dashboard'
import { DATASETS_MAP } from '../../utils/constants'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'
import SearchInput from '../../components/Header/SearchInput'
import CompareBtn from '../../components/Header/CompareBtn'
import { TempContext } from '../../utils/AppTempContext'

function Dataset() {
  const params = useParams()
  const { datasetId } = params || {}
  // TODO: temp
  const { setDarkTheme } = useContext(TempContext)

  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = datasetConfig?.name || ''
  const searchPlaceholder = datasetConfig?.searchPlaceholder || ''

  // effects
  useEffect(() => {
    setDarkTheme(datasetConfig?.darkTheme)
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
      <div>DATASET page</div>
    </Dashboard>
  )
}

export default Dataset
