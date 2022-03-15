import { cloneElement, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ArrowLeft from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowRight from '@mui/icons-material/ArrowForwardIosOutlined'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PropTypes from 'prop-types'

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
  const innerRef = useRef(null)
  const childrenArray = useMemo(() => (Array.isArray(children) ? children : [children]), [children])
  const [scrollPos, setScrollPos] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [scrollSize, setScrollSize] = useState(0)
  const showArrows = scrollSize > 0

  const handleLeft = useCallback(() => {
    const containerWidth = containerRef.current.clientWidth
    setScrollPos(scrollPos => {
      const idx = itemRef.current.findIndex(el => {
        return el.offsetLeft <= scrollPos && el.offsetLeft + el.clientWidth > scrollPos
      })
      const item = itemRef.current[idx]
      const newPos = idx === 0 ? 0 : item.offsetLeft + item.clientWidth - containerWidth
      return Math.max(newPos + (newPos > 0 ? ARROW_SIZE : 0), 0)
    })
  }, [])

  const handleRight = useCallback(() => {
    const containerWidth = containerRef.current.clientWidth
    setScrollPos(scrollPos => {
      const idx = itemRef.current.findIndex(el => {
        return el.offsetLeft + el.clientWidth - scrollPos > containerWidth
      })
      const newPos = idx < 0 ? scrollSize : itemRef.current[idx].offsetLeft
      return Math.min(newPos - ARROW_SIZE, scrollSize)
    })
  }, [scrollSize])

  useEffect(() => {
    const setDimensions = () => {
      setContainerHeight(innerRef.current.clientHeight)
      setScrollSize(Math.max(0, innerRef.current?.clientWidth - containerRef.current?.clientWidth))
    }
    setDimensions()
    window.addEventListener('resize', setDimensions)
    return () => window.removeEventListener('resize', setDimensions)
  }, [showArrows])

  useEffect(() => {
    innerRef.current.style.left = `-${scrollPos}px`
  }, [scrollPos])

  useEffect(() => {
    const containerWidth = containerRef.current.clientWidth
    const scrollPos = -innerRef.current.offsetLeft
    const valueIndex = childrenArray.findIndex(child => child.props.value === value)
    const item = itemRef.current[valueIndex]
    const itemWidth = item.clientWidth
    const itemCount = itemRef.current.length

    if (!item) {
      return
    }
    if (valueIndex === 0 && item.offsetLeft - scrollPos < 0) {
      setScrollPos(item.offsetLeft)
    } else if (valueIndex > 0 && item.offsetLeft - ARROW_SIZE - scrollPos < 0) {
      setScrollPos(item.offsetLeft - ARROW_SIZE)
    } else if (valueIndex + 1 < itemCount && item.offsetLeft + itemWidth - scrollPos > containerWidth - ARROW_SIZE) {
      setScrollPos(item.offsetLeft + itemWidth - containerWidth + ARROW_SIZE)
    } else if (item.offsetLeft + itemWidth - scrollPos > containerWidth) {
      setScrollPos(item.offsetLeft + itemWidth - containerWidth)
    } else if (scrollPos > scrollSize) {
      setScrollPos(scrollSize)
    }
  }, [childrenArray, value, scrollSize])

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {showArrows && scrollPos !== 0 && (
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
          overflow: 'hidden',
          overflowX: 'scroll',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
        ref={containerRef}
        style={{ height: containerHeight }}>
        <Box
          sx={{
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            position: 'absolute',
            transition: 'left ease-in-out 0.2s',
          }}
          ref={innerRef}>
          {childrenArray.map((child, index) =>
            cloneElement(child, {
              ref: el => (itemRef.current[index] = el),
              key: child.key || index,
            }),
          )}
        </Box>
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
