import React, { useEffect, useLayoutEffect, useRef } from 'react'
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

function AtlasBreadcrumbs({
  links = [],
  hidden,
  truncateCount,
  setTruncateCount,
  breadcrumbsWidth,
  setBreadcrumbsWidth,
  containerWidth,
  setContainerWidth,
  widthsList,
  setWidthsList,
}) {
  const containerRef = useRef()
  const isEntryLoading = useSelector(isRequestPending('datasetDetailData', 'get'))
  const isDatasetLoading = useSelector(isRequestPending('datasetList', 'get'))

  const otherProps = hidden
    ? {
        sx: {
          visibility: 'hidden',
          position: 'absolute',
        },
        'aria-label': 'none',
        role: 'none',
      }
    : {
        sx: {
          width: '100%',
          overflow: 'hidden',
        },
      }

  useLayoutEffect(() => {
    const containerNode = containerRef?.current
    const containerWidth = containerNode?.offsetWidth

    if (hidden) {
      setBreadcrumbsWidth(containerWidth)
    } else {
      setContainerWidth(containerWidth)
      return
    }

    const childNodes = containerNode?.querySelectorAll?.('li:not(.MuiBreadcrumbs-separator)') || []
    const widthsList = []
    ;[...childNodes].forEach(node => widthsList.push(node.offsetWidth))
    setWidthsList(widthsList)
  }, [isEntryLoading, isDatasetLoading, hidden, setBreadcrumbsWidth, setContainerWidth, setWidthsList])

  useEffect(() => {
    if (hidden) {
      return
    }

    function handleResize() {
      let breadcrumbsWidthTemp = breadcrumbsWidth
      const allocatedBreadcrumbsWidth = containerRef.current?.offsetWidth

      let truncateCount = 0
      links.forEach((item, index) => {
        if (breadcrumbsWidthTemp > allocatedBreadcrumbsWidth) {
          const itemWidth = widthsList[links.length - 1 - index]
          const ellipsisWidth = 22
          breadcrumbsWidthTemp -= itemWidth - ellipsisWidth
          truncateCount++
        }
      })

      setTruncateCount(truncateCount)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [breadcrumbsWidth, hidden, containerWidth, links, setContainerWidth, setTruncateCount, widthsList])

  return (
    <Breadcrumbs ref={containerRef} aria-label="breadcrumb" {...otherProps}>
      {(links || []).map((linkItem, index) => (
        <BreadcrumbLink
          key={index}
          linkItem={linkItem}
          truncate={hidden ? false : index >= links.length - truncateCount}
        />
      ))}
    </Breadcrumbs>
  )
}

AtlasBreadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.any,
      text: PropTypes.any,
    }),
  ),
  hidden: PropTypes.bool,
  truncateCount: PropTypes.number,
  breadcrumbsWidth: PropTypes.number,
  containerWidth: PropTypes.number,
  widthsList: PropTypes.arrayOf(PropTypes.number),
  setWidthsList: PropTypes.func,
  setTruncateCount: PropTypes.func,
  setContainerWidth: PropTypes.func,
  setBreadcrumbsWidth: PropTypes.func,
}

export default AtlasBreadcrumbs
