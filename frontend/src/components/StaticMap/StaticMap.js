import React, { useEffect, useMemo, useRef, useState } from 'react'
import { generateSize, getScaleTranslation } from './StaticMap.utils'
import { geoMercator, geoPath } from 'd3-geo'
import { useTheme } from '@mui/system'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'

const StaticMap = ({ geoJSON, square, height: mapHeight, areaId }) => {
  const theme = useTheme()
  const {
    background,
    selectedBgColor,
    selectedBorderColor,
    selectedBgOpacity,
    otherBgColor,
    otherBorderColor,
    strokeWidth,
  } = theme.components.StaticMap
  const ref = useRef(null)
  const [size, setSize] = useState(generateSize(ref, square, mapHeight))
  const { width, height } = size
  const location = useMemo(
    () =>
      geoJSON?.features.filter(function (d) {
        return d.id === areaId
      })[0],
    [geoJSON, areaId],
  )

  useEffect(() => {
    const handleResize = () => setSize(generateSize(ref, square, mapHeight))
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [square, mapHeight])

  if (!geoJSON) {
    return null
  }

  const projection = geoMercator().fitSize([width, height], geoJSON)
  const pathGenerator = geoPath().projection(projection)
  projection.scale(1).translate([0, 0])
  const [s, t] = getScaleTranslation(pathGenerator, location, width, height)
  projection.scale(s).translate(t)
  const shouldRenderMap = width > 0 && height > 0

  return (
    <Box
      ref={ref}
      sx={{
        overflow: 'hidden',
        background,
        height,
      }}>
      {shouldRenderMap && (
        <svg width={'100%'} height={'100%'}>
          {geoJSON?.features.map((d, idx) => (
            <path
              key={'path' + idx}
              d={pathGenerator(d)}
              fill={d.id === areaId ? selectedBgColor : otherBgColor}
              stroke={d.id === areaId ? selectedBorderColor : otherBorderColor}
              fillOpacity={d.id === areaId ? selectedBgOpacity : 1}
              strokeWidth={strokeWidth}
            />
          ))}
        </svg>
      )}
    </Box>
  )
}

StaticMap.propTypes = {
  geoJSON: PropTypes.object,
  square: PropTypes.bool,
  height: PropTypes.number,
  areaId: PropTypes.string.isRequired,
}

export default StaticMap
