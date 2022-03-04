import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import { Box, createStyles, GlobalStyles, Tooltip } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import SimpleRange from '../SimpleRange'
import Select from '../Select'
import MapPopupContent from '../MapPopupContent'
import { MAPBOX_API_KEY } from '../../utils/constants'

mapboxgl.accessToken = MAPBOX_API_KEY

const popupClassName = 'floating-popup'
const popupContainerStyles = createStyles({
  '.mapboxgl-popup-tip': {
    display: 'none',
  },

  '.mapboxgl-popup-content': {
    padding: '0',
    background: 'transparent',
    boxShadow: 'none',
  },

  [`.${popupClassName}.immobile .mapboxgl-popup-content`]: {
    background: 'rgba(255, 255, 255, 1.0)',
  },
})

function Map({ config, hidePopup }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [selectedMetric, setSelectedMetric] = useState('')
  const [data, setData] = useState([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [metricConfig, setMetricConfig] = useState(null)
  const [colorScheme, setColorScheme] = useState([])
  const [layerIds, setLayerIds] = useState([])
  const [sourceIds, setSourceIds] = useState([])

  const colorSchemeDomain = useMemo(() => metricConfig?.layers?.[0]?.metric?.domain || [], [metricConfig?.layers])

  // methods
  const getData = useCallback(async url => {
    setData([])
    if (!url) {
      return
    }

    // TODO: use client instance instead
    try {
      const res = await fetch(url)
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const initMap = useCallback(() => {
    // initialize map only once
    if (map.current || !config) {
      return
    }

    setSelectedMetric(config?.defaultMetric)

    const { style, bounds, fitBoundsOptions } = config?.options || {}

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      bounds,
      fitBoundsOptions,
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')
  }, [config])

  const initPopup = useCallback(
    ({ foreignKey, metricKey, titleKey, layerId, sourceLayer }) => {
      let hoverPopupTimeout = null
      let hoveredFeatureId = null
      let popupExpanded = null
      const hoverPopup = new mapboxgl.Popup({
        anchor: 'top',
        closeButton: false,
        closeOnClick: false,
        className: popupClassName,
        offset: [0, 10],
        maxWidth: 'none',
      })

      const expandPopup = () => {
        popupExpanded = true
        const row = data.find(r => r[foreignKey] === hoveredFeatureId)

        const popupNode = document.createElement('div')
        ReactDOM.render(
          <MapPopupContent
            id={row?.id}
            title={row?.[titleKey]}
            metricName={metricConfig?.title}
            data={row?.[metricKey] ?? 0}
            colorScheme={colorScheme}
            colorSchemeDomain={colorSchemeDomain}
            addToComparison
          />,
          popupNode,
        )

        hoverPopup.setDOMContent(popupNode).addClassName('immobile')
      }

      map.current.on('mousemove', layerId, e => {
        if (e.features.length > 0) {
          if (hoveredFeatureId !== e.features[0].id) {
            popupExpanded = false
            map.current.setFeatureState(
              { source: sourceLayer, sourceLayer: sourceLayer, id: hoveredFeatureId },
              { hover: false },
            )
            hoveredFeatureId = e.features[0].id
            map.current.setFeatureState(
              { source: sourceLayer, sourceLayer: sourceLayer, id: hoveredFeatureId },
              { hover: true },
            )

            if (hidePopup) {
              return
            }

            const row = data.find(r => r[foreignKey] === e.features[0].id)

            const popupNode = document.createElement('div')
            ReactDOM.render(
              <MapPopupContent
                id={e.features[0].id}
                title={row?.[titleKey]}
                metricName={metricConfig?.title}
                data={row?.[metricKey] ?? 0}
                colorScheme={colorScheme}
                colorSchemeDomain={colorSchemeDomain}
              />,
              popupNode,
            )

            hoverPopup.setDOMContent(popupNode).addTo(map.current).removeClassName('immobile')
          }

          !popupExpanded && hoverPopup.setLngLat(e.lngLat)
          // 1. While the cursor is moving over a region, show a short
          //    popup which moves with the mouse.
          //
          // 2. If the cursor is idle over a region, expand the popup to
          //    include interactive controls and freeze it in place so
          //    the user can interact with it. Unfreeze the popup and
          //    revert to short version if the cursor moves far enough
          //    outside of it.

          clearTimeout(hoverPopupTimeout)
          hoverPopupTimeout = setTimeout(expandPopup, 700)
        }
      })

      map.current.on('mouseleave', layerId, () => {
        if (hoveredFeatureId !== null) {
          popupExpanded = false
          map.current.setFeatureState(
            { source: sourceLayer, sourceLayer: sourceLayer, id: hoveredFeatureId },
            { hover: false },
          )
        }

        if (popupExpanded) {
          return
        }

        hoverPopup.remove().removeClassName('immobile')
        hoveredFeatureId = null
        clearTimeout(hoverPopupTimeout)
      })
    },
    [colorScheme, colorSchemeDomain, data, hidePopup, metricConfig?.title],
  )

  const updateMap = useCallback(() => {
    if (!metricConfig || !data?.length || !mapLoaded || !map.current) {
      return
    }

    const layerIds = []
    const sourceIds = []

    const { geometry, layers } = metricConfig || {}

    layers.forEach(layer => {
      const paint = layer?.paint
      const sourceLayer = layer?.sourceLayer
      const beforeId = layer?.beforeId
      const mapType = metricConfig?.type
      const titleKey = metricConfig?.geometry?.titleKey
      const foreignKey = 'id'
      const metricKey = 'data'
      const fillsId = `regions-${sourceLayer}-fills`
      const linesId = `regions-${sourceLayer}-lines`
      const hoverId = `regions-${sourceLayer}-hover-outline`

      // TODO: temp - add other types
      if (mapType !== 'chloropleth') {
        return
      }

      map.current.addSource(sourceLayer, geometry)
      sourceIds.push(sourceLayer)

      // TODO: refactor
      const mergeData = data => {
        data.forEach(row => {
          if (row.hasOwnProperty(metricKey) && row[metricKey] !== null) {
            map.current.setFeatureState(
              {
                source: sourceLayer,
                sourceLayer: sourceLayer,
                id: row[foreignKey],
              },
              {
                [metricKey]: row[metricKey],
              },
            )
          }
        })
      }
      mergeData(data)

      if (paint?.default) {
        if (paint.default?.fill) {
          map.current.addLayer(
            {
              id: fillsId,
              type: 'fill',
              source: sourceLayer,
              'source-layer': sourceLayer,
              paint: {
                'fill-color': [
                  'case',
                  ['!=', ['feature-state', metricKey], null],
                  buildColorExpression({ paint, layer, metricKey: 'data' }),
                  ['to-color', paint.default?.fill?.fallbackColor],
                ],
                'fill-opacity': [
                  'case',
                  ['to-boolean', ['feature-state', 'hover']],
                  paint.hover?.fill?.opacity ?? paint.default?.fill?.opacity ?? 1.0,
                  paint.default?.fill?.opacity ?? 1.0,
                ],
              },
            },
            beforeId,
          )

          layerIds.push(fillsId)
        }

        map.current.addLayer(
          {
            id: linesId,
            type: 'line',
            source: sourceLayer,
            'source-layer': sourceLayer,
            paint: {
              'line-color': ['to-color', paint.default?.outline?.color ?? '#000000'],
              'line-width': paint.default?.outline?.width ?? 1.0,
              'line-opacity': paint.default?.outline?.opacity ?? 1.0,
            },
          },
          beforeId,
        )

        layerIds.push(linesId)
      }

      if (paint?.hover) {
        // Use a separate layer to highlight the hovered feature so it doesn't
        // z-fight with the outlines of adjacent features. Only a problem when
        // default.color and hover.color are different colors.
        map.current.addLayer(
          {
            id: hoverId,
            type: 'line',
            source: sourceLayer,
            'source-layer': sourceLayer,
            paint: {
              'line-color': ['to-color', paint.hover?.outline?.color ?? paint?.default?.outline?.color ?? '#000000'],
              'line-width': paint.hover?.outline?.width ?? paint?.default?.outline?.width ?? 1.0,
              'line-opacity': [
                'case',
                ['to-boolean', ['feature-state', 'hover']],
                paint.hover?.outline?.opacity ?? paint?.default?.outline?.opacity ?? 1.0,
                0.0,
              ],
            },
          },
          beforeId,
        )

        layerIds.push(hoverId)

        initPopup({ foreignKey, metricKey, titleKey, layerId: fillsId, sourceLayer })
      }

      setLayerIds(layerIds)
      setSourceIds(sourceIds)
    })
  }, [data, initPopup, mapLoaded, metricConfig])

  const cleanMap = useCallback(() => {
    setLayerIds(layerIds => {
      layerIds.forEach(id => {
        const layer = map.current.getLayer(id)
        if (layer) {
          map.current.removeLayer(id)
        }
      })
      return []
    })

    setSourceIds(sourceIds => {
      sourceIds.forEach(id => {
        const source = map.current.getSource(id)
        if (source) {
          map.current.removeSource(id)
        }
      })
      return []
    })
  }, [])

  // effects
  useEffect(() => {
    updateMap()

    return () => cleanMap()
  }, [cleanMap, updateMap])

  useEffect(() => {
    initMap()

    return () => {
      map.current?.remove?.()
      map.current = null
    }
  }, [initMap])

  useEffect(() => {
    const newMetricConfig = config?.metrics?.find(item => item?.id === selectedMetric) ?? {}
    const colorScheme = newMetricConfig?.layers?.[0]?.paint?.default?.fill?.colorScheme ?? []
    setMetricConfig(newMetricConfig)
    setColorScheme(colorScheme)
    getData(newMetricConfig?.data?.url)
  }, [config, getData, selectedMetric])

  return (
    <Box position={'absolute'} top={0} bottom={0} left={0} right={0}>
      <GlobalStyles styles={{ [`.${popupClassName}`]: popupContainerStyles }} />

      <div ref={mapContainer} style={{ height: '100%', width: '100%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }} />

      <Box
        position={'absolute'}
        bottom={38}
        left={12}
        bgcolor={'#fff'}
        p={1.5}
        borderRadius={1}
        width={theme => theme.components.floatingFilter.width}>
        <Box display={'flex'} alignItems={'center'}>
          <Select
            value={selectedMetric}
            onChange={e => setSelectedMetric(e?.target?.value)}
            options={config?.metrics}
            labelId="demo-simple-select-filled-label"
            label="Growth"
            menuPlacement={'top'}
            sx={{ mb: 1 }}
          />

          <Box component={'span'} ml={1.25}>
            <Tooltip title="Info tooltip" placement={'top'}>
              <InfoOutlined sx={{ color: '#B3B3B3' }} />
            </Tooltip>
          </Box>
        </Box>

        <div>
          <SimpleRange
            value={100}
            min={0}
            max={100}
            style={'gradient'}
            colorScheme={colorScheme || []}
            colorSchemeDomain={colorSchemeDomain}
          />

          {/* TODO: check if this should be dynamic */}
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            color={theme => theme.palette.darkGrey.main}
            fontSize={12}>
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </Box>
        </div>
      </Box>
    </Box>
  )
}

/**
 *
 * @param paint
 * @param layer
 * @param metricKey
 * @return {*[]}
 */
function buildColorExpression({ paint, layer, metricKey }) {
  const { scale, domain } = layer?.metric || {}
  const colorScheme = paint.default?.fill?.colorScheme
  const result = []

  switch (scale) {
    case 'step':
      result.push('step')
      break
    case 'linear':
    default:
      result.push('interpolate', ['linear'])
  }

  result.push(['feature-state', metricKey])

  // Build alternating list of numbers and colors
  if (scale === 'step') {
    result.push(['to-color', colorScheme.shift()])
  }
  colorScheme.forEach((color, i) => {
    result.push(domain[i], ['to-color', color])
  })
  return result
}

export default Map
