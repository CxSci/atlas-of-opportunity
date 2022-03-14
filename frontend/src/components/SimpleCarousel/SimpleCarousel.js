import { cloneElement, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ArrowLeft from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowRight from '@mui/icons-material/ArrowForwardIosOutlined'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import PropTypes from 'prop-types'

const getOuterWidth = element => {
  const style = window.getComputedStyle(element)
  return (
    parseFloat(style.marginLeft) +
    parseFloat(style.marginRight) +
    parseFloat(style.borderLeftWidth) +
    parseFloat(style.borderRightWidth) +
    element.clientWidth
  )
}

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
    setScrollPos(scrollPos => {
      const idx = itemRef.current.findIndex(el => {
        return el.offsetLeft >= scrollPos
      })
      const newPos = idx === 0 ? 0 : itemRef.current[idx - 1].offsetLeft
      return Math.max(newPos, 0)
    })
  }, [])

  const handleRight = useCallback(() => {
    setScrollPos(scrollPos => {
      const idx = itemRef.current.findIndex(el => {
        return el.offsetLeft <= scrollPos && el.offsetLeft + getOuterWidth(el) > scrollPos
      })
      const newPos = idx + 1 === itemRef.current.length ? scrollSize : itemRef.current[idx + 1].offsetLeft
      return Math.min(newPos, scrollSize)
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
          <IconButton onClick={handleLeft} disabled={scrollPos === 0}>
            <ArrowLeft fontSize="small" />
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
          <IconButton onClick={handleRight} disabled={scrollPos === scrollSize}>
            <ArrowRight fontSize="small" />
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
