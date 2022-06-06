import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mapboxgl from 'mapbox-gl'
import { Box, GlobalStyles, Tooltip } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'

import SimpleRange from '../SimpleRange'
import Select from '../Select'
import MapPopupContent from '../MapPopupContent'
import { getDatasetMetricData, datasetMetricDataSelector } from 'store/modules/dataset'
import { MAPBOX_API_KEY } from '../../utils/constants'

mapboxgl.accessToken = MAPBOX_API_KEY

const popupClassName = 'floating-popup'
const popupContainerStyles = {
  '.mapboxgl-popup-tip': {
    display: 'none',
  },

  '.mapboxgl-popup-content': {
    padding: '0',
    background: 'transparent',
    boxShadow: 'none',
  },

  '&:not(.immobile) .mapboxgl-popup-content': {
    pointerEvents: 'none',
  },
}
const mapGlobalStyles = {
  [`.${popupClassName}`]: popupContainerStyles,
}

function Map({
  config,
  hidePopup,
  datasetId,
  selectedFeature,
  highlightedFeature,
  addToComparison,
  canAddToComparison,
  setSelectedFeature,
  setHighlightedFeature,
}) {
  const mapContainerRef = useRef(null)
  const popupContainerRef = useRef(null)
  const popupLayerIdRef = useRef(null)
  const hoverPopupRef = useRef(null)
  const hoveredFeatureIdRef = useRef(null)
  const map = useRef(null)
  const onMouseMoveRef = useRef(null)
  const onMouseLeaveRef = useRef(null)
  const onMapMoveRef = useRef(null)
  const onMapClickRef = useRef(null)
  const onAllMapMouseMoveRef = useRef(null)
  const [selectedMetric, setSelectedMetric] = useState('')
  const dispatch = useDispatch()
  const data = useSelector(datasetMetricDataSelector)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [metricConfig, setMetricConfig] = useState(null)
  const [colorScheme, setColorScheme] = useState([])
  const [popupData, setPopupData] = useState(null)

  const domain = useMemo(() => metricConfig?.layers?.[0]?.metric?.domain || [], [metricConfig?.layers])

  const initPopup = useCallback(
    ({ foreignKey, metricKey, titleKey, layerId, sourceLayer, metricConfig, data }) => {
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove()
      }

      const sourceName = createSourceName(metricConfig?.geometry)
      let hoverPopupTimeout = null
      let popupExpanded = null
      const popupOffsetY = 10
      const prevLayerId = popupLayerIdRef.current
      const hoverPopup = new mapboxgl.Popup({
        anchor: 'top',
        closeButton: false,
        closeOnClick: false,
        className: popupClassName,
        offset: [0, popupOffsetY],
        maxWidth: 'none',
        focusAfterOpen: false,
      })

      hoverPopupRef.current = hoverPopup

      const expandPopup = () => {
        const popupElement = hoverPopup.getElement()
        if (!popupElement) {
          return
        }

        popupExpanded = true
        if (hoveredFeatureIdRef.current === null) {
          return
        }
        setPopupData(oldData => ({ ...oldData, expanded: true }))
        hoverPopup.addClassName('immobile')
      }

      // mouse move event
      if (onMouseMoveRef.current) {
        map.current.off('mousemove', prevLayerId, onMouseMoveRef.current)
        onMouseMoveRef.current = null
      }

      map.current.on('mousemove', layerId, onMouseMove)

      function onMouseMove(e) {
        if (e?.features?.length > 0 && !popupExpanded) {
          if (hoveredFeatureIdRef.current !== e.features[0].id) {
            popupExpanded = false
            map.current.setFeatureState(
              { source: sourceName, sourceLayer: sourceLayer, id: hoveredFeatureIdRef.current },
              { hover: false },
            )
            hoveredFeatureIdRef.current = e.features[0].id
            map.current.setFeatureState(
              { source: sourceName, sourceLayer: sourceLayer, id: hoveredFeatureIdRef.current },
              { hover: true },
            )

            if (hidePopup) {
              return
            }

            const title = e.features[0]?.properties?.[titleKey]
            const row = data.find(r => r[foreignKey] === e.features[0].id)

            setPopupData({
              id: e.features[0].id,
              title,
              metricName: metricConfig?.title,
              data: row?.[metricKey] ?? 0,
              colorScheme,
              domain,
            })

            hoverPopup.removeClassName('immobile')
            if (!hoverPopup.isOpen()) {
              hoverPopup.setDOMContent(popupContainerRef.current).addTo(map.current)
            }
          }

          hoverPopup.setLngLat(e.lngLat)

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
      }
      onMouseMoveRef.current = onMouseMove

      // whole map mouse move event
      if (onAllMapMouseMoveRef.current) {
        map.current.off('mousemove', onAllMapMouseMoveRef.current)
        onAllMapMouseMoveRef.current = null
      }

      map.current.on('mousemove', onAllMapMouseMove)

      function onAllMapMouseMove(e) {
        if (!popupExpanded) {
          return
        }

        const { x: pointerX, y: pointerY } = e?.point || {}
        const popupElement = hoverPopup.getElement()
        const popupRect = popupElement?.getBoundingClientRect?.()
        const offsetTop = 20
        const offsetSides = 10

        const movedAwayFromPopup =
          pointerY < popupRect?.top - offsetTop ||
          pointerY > popupRect?.bottom + offsetSides ||
          pointerX < popupRect?.left - offsetSides ||
          pointerX > popupRect?.right + offsetSides

        if (movedAwayFromPopup) {
          map.current.setFeatureState(
            { source: sourceName, sourceLayer: sourceLayer, id: hoveredFeatureIdRef.current },
            { hover: false },
          )

          hoveredFeatureIdRef.current = null
          popupExpanded = false
          setPopupData(oldData => ({ ...oldData, expanded: false }))
          hoverPopup.remove()
        }
      }
      onAllMapMouseMoveRef.current = onAllMapMouseMove

      // mouse leave event
      if (onMouseLeaveRef.current) {
        map.current.off('mouseleave', prevLayerId, onMouseLeaveRef.current)
        onMouseLeaveRef.current = null
      }

      map.current.on('mouseleave', layerId, onMouseLeave)

      function onMouseLeave() {
        if (popupExpanded) {
          return
        }

        if (hoveredFeatureIdRef.current !== null) {
          popupExpanded = false
          map.current.setFeatureState(
            { source: sourceName, sourceLayer: sourceLayer, id: hoveredFeatureIdRef.current },
            { hover: false },
          )
        }

        hoverPopup.remove().removeClassName('immobile')
        hoveredFeatureIdRef.current = null
        clearTimeout(hoverPopupTimeout)
      }
      onMouseLeaveRef.current = onMouseLeave

      // map move event
      if (onMapMoveRef.current) {
        map.current.off('move', prevLayerId, onMapMoveRef.current)
        onMapMoveRef.current = null
      }

      map.current.on('move', layerId, onMapMove)

      function onMapMove() {
        clearTimeout(hoverPopupTimeout)
        hoverPopupTimeout = setTimeout(expandPopup, 700)
      }
      onMapMoveRef.current = onMapMove

      // map click event
      if (onMapClickRef.current) {
        map.current.off('click', prevLayerId, onMapClickRef.current)
        onMapClickRef.current = null
      }

      map.current.on('click', layerId, onMapClick)

      function onMapClick(e) {
        const feature = e.features[0]

        if (feature) {
          expandPopup()
        }
      }
      onMapClickRef.current = onMapMove

      popupLayerIdRef.current = layerId
    },
    [hidePopup, colorScheme, domain],
  )

  const updateMap = useCallback(() => {
    if (!metricConfig || !data?.length || !mapLoaded || !map.current) {
      return
    }

    const layerIds = []
    const sourceIds = []

    const { geometry, layers } = metricConfig || {}
    const mapType = metricConfig?.type
    const titleKey = metricConfig?.geometry?.titleKey
    const foreignKey = 'id'
    const metricKey = 'data'
    const sourceName = createSourceName(geometry)

    sourceIds.push(sourceName)
    const source = map.current.getSource(sourceName)
    if (!source) {
      map.current.addSource(sourceName, geometry)
    }

    layers.forEach(layer => {
      const paint = layer?.paint
      const sourceLayer = layer?.sourceLayer
      const beforeId = layer?.beforeId
      const fillsId = `regions-${sourceLayer}-fills`
      const linesId = `regions-${sourceLayer}-lines`
      const hoverId = `regions-${sourceLayer}-hover-outline`

      // TODO: temp - add other types
      if (mapType !== 'chloropleth') {
        return
      }

      // TODO: refactor
      const mergeData = data => {
        data.forEach(row => {
          if (row.hasOwnProperty(metricKey) && row[metricKey] !== null) {
            map.current.setFeatureState(
              {
                source: sourceName,
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
              source: sourceName,
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
            source: sourceName,
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
            source: sourceName,
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

        initPopup({ foreignKey, metricKey, titleKey, layerId: fillsId, sourceLayer, metricConfig, data })
      }
    })

    return { layerIds, sourceIds }
  }, [data, initPopup, mapLoaded, metricConfig])

  const cleanMap = useCallback(
    ({ layerIds, sourceIds }) => {
      setSelectedFeature(null)
      setHighlightedFeature(null)

      map.current.off('mousemove', onAllMapMouseMoveRef.current)

      if (layerIds.length) {
        layerIds.forEach(id => {
          const layer = map.current.getLayer(id)
          if (layer) {
            map.current.off('mousemove', id, onMouseMoveRef.current)
            map.current.off('mouseleave', id, onMouseLeaveRef.current)
            map.current.off('move', id, onMapMoveRef.current)
            map.current.off('click', id, onMapClickRef.current)

            map.current.removeLayer(id)
          }
        })
      }

      if (sourceIds.length) {
        sourceIds.forEach(id => {
          const source = map.current.getSource(id)
          if (source) {
            map.current.removeSource(id)
          }
        })
      }
    },
    [setHighlightedFeature, setSelectedFeature],
  )

  const showPopupForFeature = useCallback(
    ({ option, expandPopup = false, fitBounds = false, previousFeatureId }) => {
      const layer = metricConfig?.layers?.[0]
      const sourceName = createSourceName(metricConfig?.geometry)
      const sourceLayer = layer?.sourceLayer

      if (!option && hoverPopupRef?.current) {
        hoverPopupRef.current.remove()

        if (previousFeatureId) {
          map.current.setFeatureState(
            { source: sourceName, sourceLayer: sourceLayer, id: previousFeatureId },
            { hover: false },
          )
        }
        return
      }

      const { bbox: bounds, id: featureId, pole_of_inaccessibility: poleOfInaccessibility = [] } = option || {}

      if (!map.current || !bounds?.length) {
        return
      }

      if (!poleOfInaccessibility?.length) {
        const lngCenter = (bounds[0] + bounds[2]) / 2
        const latCenter = (bounds[1] + bounds[3]) / 2
        poleOfInaccessibility.push(lngCenter, latCenter)
      }

      const [popupLng, popupLat] = poleOfInaccessibility
      const row = data.find(r => r?.id === featureId)
      const title = option?.title

      if (fitBounds) {
        map.current.fitBounds(bounds, { padding: 200 })
      }

      setPopupData({
        id: featureId,
        title,
        metricName: metricConfig?.title,
        data: row?.data ?? 0,
        colorScheme,
        domain,
        expanded: Boolean(expandPopup),
      })

      map.current.setFeatureState(
        { source: sourceName, sourceLayer: sourceLayer, id: hoveredFeatureIdRef.current },
        { hover: false },
      )
      hoveredFeatureIdRef.current = featureId
      map.current.setFeatureState(
        { source: sourceName, sourceLayer: sourceLayer, id: hoveredFeatureIdRef.current },
        { hover: true },
      )

      hoverPopupRef.current.setLngLat({ lng: popupLng, lat: popupLat })
      hoverPopupRef.current.setDOMContent(popupContainerRef.current).addTo(map.current)

      if (expandPopup) {
        hoverPopupRef.current.addClassName('immobile')
      }

      return featureId
    },
    [colorScheme, data, domain, metricConfig?.geometry, metricConfig?.layers, metricConfig?.title],
  )

  // effects
  useEffect(() => {
    setSelectedFeature(null)
    setHighlightedFeature(null)
  }, [selectedMetric, setSelectedFeature, setHighlightedFeature])

  useEffect(() => {
    const { layerIds = [], sourceIds = [] } = updateMap() || {}
    return () => cleanMap({ layerIds, sourceIds })
  }, [cleanMap, updateMap])

  useEffect(() => {
    // initialize map only once
    if (map.current || !config) {
      return
    }

    setSelectedMetric(config?.defaultMetric)

    const { style, bounds, fitBoundsOptions } = config?.options || {}

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style,
      bounds,
      fitBoundsOptions,
      // Track and control map location via the location hash.
      // e.g. #map={zoom}/{lat}/{lng}/{bearing}/{pitch}
      //
      // Uses a query parameter style. `map` is reserved for this, but other
      // parameters can be added, e.g. #map=...&foo=bar.
      //
      // Note: See comment below about a known bug related to hash: 'map'.
      hash: 'map',
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')

    return () => {
      // There's a known bug with `hash: 'map'` where it updates the location
      // hash one last time after being removed here. That means any
      // react-router `<Link>` from here to another page would end up with an
      // extra hash set like `#map=5.09/-32.2/135`. The `replaceState``call
      // below is necessary to prevent that, though it also removes the hash
      // fragment from any link on this page.
      // See https://github.com/mapbox/mapbox-gl-js/issues/11409.
      map.current?.remove?.()
      map.current = null

      // resets map's location hash
      window.history.replaceState(null, null, ' ')
    }
  }, [config])

  useEffect(() => {
    const newMetricConfig = config?.metrics?.find(item => item?.id === selectedMetric) ?? {}
    const colorScheme = newMetricConfig?.layers?.[0]?.paint?.default?.fill?.colorScheme ?? []
    setMetricConfig(newMetricConfig)
    setColorScheme(colorScheme)
    dispatch(getDatasetMetricData({ url: newMetricConfig?.data?.url }))
  }, [config, dispatch, selectedMetric])

  useEffect(() => {
    showPopupForFeature({ option: selectedFeature, expandPopup: true, fitBounds: true })
    return () => showPopupForFeature({ previousFeatureId: selectedFeature?.id })
  }, [selectedFeature, showPopupForFeature])

  useEffect(() => {
    showPopupForFeature({ option: highlightedFeature })
    return () => showPopupForFeature({ previousFeatureId: highlightedFeature?.id })
  }, [highlightedFeature, showPopupForFeature])

  return (
    <Box position={'absolute'} top={0} bottom={0} left={0} right={0}>
      <GlobalStyles styles={mapGlobalStyles} />

      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      <div ref={popupContainerRef}>
        {popupData?.id && (
          <MapPopupContent
            datasetId={datasetId}
            addToComparison={addToComparison}
            canAddToComparison={canAddToComparison}
            {...popupData}
          />
        )}
      </div>

      <Box
        position={'absolute'}
        bottom={38}
        left={12}
        bgcolor={'#fff'}
        p={1.5}
        borderRadius={1}
        boxShadow={'0px 2px 4px rgba(0, 0, 0, 0.25)'}
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
          <SimpleRange value={Math.max(...domain)} variant={'gradient'} colorScheme={colorScheme} domain={domain} />

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

/**
 *
 * @param geometry
 * @return {string}
 */
function createSourceName(geometry) {
  const urlHash = encodeURIComponent(geometry?.url || '')
  const promoteId = geometry?.promoteId || ''

  return `source_${urlHash}_${promoteId}`
}

export default Map
