import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, matchPath, useNavigate, useParams } from 'react-router'

import Header from './Header'
import PATH from '../../utils/path'
import { DATASETS_MAP, SHOW_SCROLLED_HEADER_HEIGHT } from '../../utils/constants'

function HeaderContainer({ toggleSidebar }) {
  // hooks
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  // state
  const [windowScroll, setWindowScroll] = useState(window.scrollY)

  // vars
  const pageScrolled = useMemo(() => windowScroll > SHOW_SCROLLED_HEADER_HEIGHT, [windowScroll])
  const { datasetId, entryId } = params || {}
  const isSmallBusinessPage = datasetId === 'small-business'
  const isOccupationsPage = datasetId === 'occupations'
  const isExplorePage = location.pathname.includes('/explore')
  const isDetailPage = matchPath(PATH.DATASET_ENTRY, location.pathname)
  const isComparePage = location.pathname.includes('/compare')
  const searchPlaceholder = isSmallBusinessPage
    ? 'Search by region or suburb'
    : isOccupationsPage
    ? 'Search by occupation'
    : ''

  const datasetConfig = DATASETS_MAP?.[datasetId]
  const datasetName = datasetConfig?.name

  // methods
  const onScroll = useCallback(e => {
    setWindowScroll(window.scrollY)
  }, [])

  const goBack = useCallback(() => {
    let backRoute = location.pathname
    const backRouteSplit = backRoute.split('/')

    if (backRouteSplit[backRouteSplit.length - 1] === '') {
      backRouteSplit.pop()
    }

    backRouteSplit.pop()
    backRoute = backRouteSplit.join('/')

    navigate(backRoute)
  }, [location.pathname, navigate])

  // effects
  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  return (
    <Header
      toggleSidebar={toggleSidebar}
      scrolled={pageScrolled}
      showSearch={isExplorePage && !isDetailPage && !isComparePage}
      searchPlaceholder={searchPlaceholder}
      isDetailPage={isDetailPage}
      isExplorePage={isExplorePage}
      isComparePage={isComparePage}
      goBack={goBack}
      datasetId={datasetId}
      datasetName={datasetName}
      showBackBtn={isDetailPage || isComparePage}
    />
  )
}

export default HeaderContainer
