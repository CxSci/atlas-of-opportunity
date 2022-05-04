import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
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

function AtlasBreadcrumbs({ links = [] }) {
  const containerRef = useRef()
  const cloneRef = useRef()
  const [containerWidth, setContainerWidth] = useState(0)
  const [widthsList, setWidthsList] = useState([])
  const [truncateCount, setTruncateCount] = useState(0)
  const isEntryLoading = useSelector(isRequestPending('datasetDetailData', 'get'))
  const isDatasetLoading = useSelector(isRequestPending('datasetList', 'get'))

  useLayoutEffect(() => {
    if (cloneRef.current) {
      document.body.removeChild(cloneRef.current)
    }

    const containerNodeClone = containerRef?.current?.cloneNode?.(true)
    containerNodeClone.style = ' opacity: 0; max-height: 0'
    containerNodeClone.childNodes[0].style = 'display: inline-flex'
    containerNodeClone.querySelectorAll('.header__link--truncated').forEach(link => {
      link.classList.remove('header__link--truncated')
    })
    cloneRef.current = containerNodeClone
    document.body.appendChild(containerNodeClone)

    const containerWidth = containerNodeClone?.childNodes?.[0]?.offsetWidth
    setContainerWidth(containerWidth)
    const childNodes = containerNodeClone?.querySelectorAll?.('li:not(.MuiBreadcrumbs-separator)') || []
    const widthsList = []
    ;[...childNodes].forEach((node, index) => widthsList.push(node.offsetWidth))

    setWidthsList(widthsList)
  }, [isEntryLoading, isDatasetLoading])

  useEffect(() => {
    function handleResize() {
      let breadcrumbsWidth = containerWidth
      const windowWidth = window.innerWidth
      const headerRightContentNode = document.querySelector('.header__right-content')
      const headerActionBtnNode = document.querySelector('.header__action-btn')
      const rightContentWidth = headerRightContentNode?.offsetWidth
      const actionBtnWidth = headerActionBtnNode?.offsetWidth + 16

      const allocatedBreadcrumbsWidth = windowWidth - rightContentWidth - actionBtnWidth - 40

      let truncateCount = 0
      links.forEach((item, index) => {
        if (breadcrumbsWidth > allocatedBreadcrumbsWidth) {
          const itemWidth = widthsList[links.length - 1 - index]
          const ellipsisWidth = 22
          breadcrumbsWidth -= itemWidth - ellipsisWidth
          truncateCount++
        }
      })

      setTruncateCount(truncateCount)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [containerWidth, links, widthsList])

  useEffect(() => {
    return () => {
      if (cloneRef.current) {
        document.body.removeChild(cloneRef.current)
      }
    }
  }, [])

  return (
    <Breadcrumbs ref={containerRef} aria-label="breadcrumb">
      {(links || []).map((linkItem, index) => (
        <BreadcrumbLink key={index} linkItem={linkItem} truncate={index >= links.length - truncateCount} />
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
}

export default AtlasBreadcrumbs
