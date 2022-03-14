import { cloneElement, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ArrowLeft from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowRight from '@mui/icons-material/ArrowForwardIosOutlined'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import PropTypes from 'prop-types'

const SCROLL_VALUE = 100

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
  const [showArrows, setShowArrows] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)

  const handleLeft = useCallback(() => {
    setScrollPos(scrollPos => Math.max(scrollPos - SCROLL_VALUE, 0))
  }, [])

  const handleRight = useCallback(() => {
    const scrollSize = innerRef.current.clientWidth - containerRef.current.clientWidth
    setScrollPos(scrollPos => Math.min(scrollPos + SCROLL_VALUE, scrollSize))
  }, [])

  useEffect(() => {
    const setDimensions = () => {
      setContainerHeight(innerRef.current.clientHeight)
      setShowArrows(containerRef.current.clientWidth < innerRef.current.clientWidth)
    }
    setDimensions()
    window.addEventListener('resize', setDimensions)
    return () => window.removeEventListener('resize', setDimensions)
  }, [])

  useEffect(() => {
    innerRef.current.style.left = `${-scrollPos}px`
  }, [scrollPos])

  useEffect(() => {
    const containerWidth = containerRef.current.clientWidth
    const scrollPos = -innerRef.current.offsetLeft
    const valueIndex = childrenArray.findIndex(child => child.props.value === value)
    const item = itemRef.current[valueIndex]
    if (!item) {
      return
    }
    if (item.offsetLeft - scrollPos < 0) {
      setScrollPos(item.offsetLeft)
    } else if (item.offsetLeft + item.clientWidth - scrollPos > containerWidth) {
      setScrollPos(item.offsetLeft + item.clientWidth - containerWidth)
    }
  }, [childrenArray, value])

  return (
    <Grid container alignItems="center">
      {showArrows && (
        <Grid item>
          <IconButton onClick={handleLeft}>
            <ArrowLeft />
          </IconButton>
        </Grid>
      )}
      <Grid
        item
        xs
        sx={{ position: 'relative', overflow: 'hidden' }}
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
      </Grid>
      {showArrows && (
        <Grid item>
          <IconButton onClick={handleRight}>
            <ArrowRight />
          </IconButton>
        </Grid>
      )}
    </Grid>
  )
}

SimpleCarousel.Item = SimpleCarouselItem

SimpleCarousel.propTypes = {
  value: PropTypes.string,
  children: PropTypes.node,
}

export default SimpleCarousel
