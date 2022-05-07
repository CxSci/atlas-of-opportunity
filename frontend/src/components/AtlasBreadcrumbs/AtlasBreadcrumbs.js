import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Breadcrumbs } from '@mui/material'
import PATH from '../../utils/path'
import PropTypes from 'prop-types'
import BreadcrumbLink from './BreadcrumbLink'
import { useSelector } from 'react-redux'
import { isRequestPending } from '../../store/modules/api'

export const homeBreadcrumbLink = {
  path: PATH.HOME,
  text: 'Atlas of Opportunity',
}

const ellipsisWidth = 22

function AtlasBreadcrumbs({ links = [] }) {
  const containerRef = useRef()
  const hiddenContainerRef = useRef()
  const [widthsList, setWidthsList] = useState([])
  const [truncateCount, setTruncateCount] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [breadcrumbsWidth, setBreadcrumbsWidth] = useState(0)
  const isEntryLoading = useSelector(isRequestPending('datasetDetailData', 'get'))
  const isDatasetLoading = useSelector(isRequestPending('datasetList', 'get'))

  const setLinkWidth = useCallback(
    index => val =>
      setWidthsList(widthsList => {
        if (widthsList[index]) {
          return widthsList
        }

        widthsList[index] = val
        return [...widthsList]
      }),
    [],
  )

  useLayoutEffect(() => {
    const containerNode = containerRef?.current
    const containerWidth = containerNode?.offsetWidth
    const hiddenContainerWidth = hiddenContainerRef?.current?.offsetWidth

    setBreadcrumbsWidth(hiddenContainerWidth)
    setContainerWidth(containerWidth)
  }, [isEntryLoading, isDatasetLoading, setBreadcrumbsWidth, setContainerWidth, setWidthsList])

  useEffect(() => {
    function handleResize() {
      let breadcrumbsWidthTemp = breadcrumbsWidth
      const allocatedBreadcrumbsWidth = containerRef.current?.offsetWidth

      let truncateCount = 0
      links.forEach((item, index) => {
        if (breadcrumbsWidthTemp > allocatedBreadcrumbsWidth) {
          const itemWidth = widthsList[links.length - 1 - index]
          breadcrumbsWidthTemp -= itemWidth - ellipsisWidth
          truncateCount++
        }
      })

      setTruncateCount(truncateCount)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [breadcrumbsWidth, containerWidth, links, setContainerWidth, setTruncateCount, widthsList])

  return (
    <>
      <Breadcrumbs
        ref={containerRef}
        aria-label="breadcrumb"
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}>
        {(links || []).map((linkItem, index) => (
          <BreadcrumbLink
            key={index}
            linkItem={linkItem}
            truncate={index >= links.length - truncateCount || !widthsList[index]}
          />
        ))}
      </Breadcrumbs>

      <Breadcrumbs
        ref={hiddenContainerRef}
        role="none"
        sx={{
          visibility: 'hidden',
          position: 'absolute',
        }}>
        {(links || []).map((linkItem, index) => (
          <BreadcrumbLink key={index} linkItem={linkItem} truncate={false} setWidth={setLinkWidth(index)} />
        ))}
      </Breadcrumbs>
    </>
  )
}

AtlasBreadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.any,
      text: PropTypes.any,
    }),
  ),
}

export default AtlasBreadcrumbs
