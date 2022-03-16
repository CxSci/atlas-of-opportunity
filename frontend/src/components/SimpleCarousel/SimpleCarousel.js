import { cloneElement, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ArrowLeft from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowRight from '@mui/icons-material/ArrowForwardIosOutlined'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PropTypes from 'prop-types'

import { animateScroll } from '../../utils/animateScroll'

const ARROW_SIZE = 36

export const SimpleCarouselItem = forwardRef(({ children, sx }, ref) => {
  return (
    <Box sx={{ ...sx, display: 'inline-block' }} ref={ref}>
      {children}
    </Box>
  )
})

export const SimpleCarousel = ({ children, value }) => {
  const itemRef = useRef([])
  const containerRef = useRef(null)
  const childrenArray = useMemo(() => (Array.isArray(children) ? children : [children]), [children])
  const [scrollPos, setScrollPos] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [scrollSize, setScrollSize] = useState(0)
  const showArrows = scrollSize > 0

  const handleLeft = useCallback(() => {
    const containerWidth = containerRef.current.clientWidth
    const idx = itemRef.current.findIndex(el => {
      return el.offsetLeft - ARROW_SIZE <= scrollPos && el.offsetLeft + el.clientWidth - ARROW_SIZE > scrollPos
    })
    const item = itemRef.current[idx < 0 ? 0 : idx]
    const newPos = idx === 0 ? 0 : item.offsetLeft + item.clientWidth - containerWidth
    animateScroll(containerRef.current, { x: Math.max(newPos + (newPos > 0 ? ARROW_SIZE : 0), 0) })
  }, [scrollPos])

  const handleRight = useCallback(() => {
    const containerWidth = containerRef.current.clientWidth
    const idx = itemRef.current.findIndex(el => {
      return el.offsetLeft + el.clientWidth - scrollPos > containerWidth
    })
    const newPos = idx < 0 ? scrollSize : itemRef.current[idx].offsetLeft
    animateScroll(containerRef.current, { x: Math.min(newPos - ARROW_SIZE, scrollSize) })
  }, [scrollPos, scrollSize])

  useEffect(() => {
    const containerEl = containerRef.current
    const setDimensions = () => {
      setContainerHeight(containerEl.clientHeight)
      setScrollSize(containerEl?.scrollWidth - containerEl?.clientWidth)
    }
    const handleScroll = () => {
      setScrollPos(containerEl.scrollLeft)
    }
    window.addEventListener('resize', setDimensions)
    containerEl.addEventListener('scroll', handleScroll)
    setDimensions()
    document.fonts.ready.then(() => {
      setScrollSize(containerEl?.scrollWidth - containerEl?.clientWidth)
    })
    return () => {
      window.removeEventListener('resize', setDimensions)
      containerEl.removeEventListener('scroll', handleScroll)
    }
  }, [showArrows])

  useEffect(() => {
    const containerWidth = containerRef.current.clientWidth
    const scrollPos = containerRef.current.scrollLeft
    const valueIndex = childrenArray.findIndex(child => child.props.value === value)
    const item = itemRef.current[valueIndex]

    if (!item) {
      return
    }

    const itemWidth = item.clientWidth
    const itemCount = itemRef.current.length
    let newPos

    if (valueIndex === 0 && item.offsetLeft - scrollPos < 0) {
      newPos = item.offsetLeft
    } else if (valueIndex > 0 && item.offsetLeft - ARROW_SIZE - scrollPos < 0) {
      newPos = item.offsetLeft - ARROW_SIZE
    } else if (valueIndex + 1 < itemCount && item.offsetLeft + itemWidth - scrollPos > containerWidth - ARROW_SIZE) {
      newPos = item.offsetLeft + itemWidth - containerWidth + ARROW_SIZE
    } else if (item.offsetLeft + itemWidth - scrollPos > containerWidth) {
      const newScrollPos = item.offsetLeft + itemWidth - containerWidth
      newPos = newScrollPos + 1 >= scrollSize ? scrollSize : newScrollPos
    } else {
      return
    }
    animateScroll(containerRef.current, { x: newPos })
  }, [childrenArray, value, scrollSize])

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {showArrows && scrollPos > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: (containerHeight - ARROW_SIZE) / 2,
            zIndex: 1,
            bgcolor: 'background.default',
          }}>
          <IconButton onClick={handleLeft}>
            <ArrowLeft fontSize="small" />
          </IconButton>
        </Box>
      )}
      <Box
        sx={{
          whiteSpace: 'nowrap',
          verticalAlign: 'middle',
          overflow: 'hidden',
          overflowX: 'scroll',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
        ref={containerRef}>
        {childrenArray.map((child, index) =>
          cloneElement(child, {
            ref: el => (itemRef.current[index] = el),
            key: child.key || index,
          }),
        )}
      </Box>
      {showArrows && scrollPos < scrollSize && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: (containerHeight - ARROW_SIZE) / 2,
            zIndex: 1,
            bgcolor: 'background.default',
          }}>
          <IconButton onClick={handleRight}>
            <ArrowRight fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

SimpleCarousel.Item = SimpleCarouselItem

SimpleCarousel.propTypes = {
  value: PropTypes.string,
  children: PropTypes.node,
}

export default SimpleCarousel
