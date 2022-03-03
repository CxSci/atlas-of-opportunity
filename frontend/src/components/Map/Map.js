import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import { Box, createStyles, GlobalStyles, Tooltip } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'
import SimpleRange from '../SimpleRange'
import Select from '../Select'
import MapPopupContent from '../MapPopupContent'
import { buildColorExpression, createMapConfig } from '../../utils/helpers'
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

function Map({ config }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const clearMapFunctionsList = useRef([])
  const [selectedMetric, setSelectedMetric] = useState('')
  const [data, setData] = useState([])
  const [mapLoaded, setMapLoaded] = useState(false)

  const metricData = useMemo(
    () => (config?.metrics || [])?.find(item => item?.id === selectedMetric),
    [config?.metrics, selectedMetric],
  )

  const colorScheme = useMemo(
    () => metricData?.layers?.[0]?.paint?.default?.fill?.colorScheme || [],
    [metricData?.layers],
  )
  const colorSchemeReversed = useMemo(() => [...colorScheme].reverse(), [colorScheme])

  // methods
  const getData = useCallback(async () => {
    setData([])
    const url = metricData?.data?.url
    if (!url) return

    // TODO: use client instance instead
    try {
      const res = await fetch(metricData?.data?.url)
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    }
  }, [metricData?.data?.url])

  const initMap = useCallback(() => {
    if (map.current || !config) return // initialize map only once

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
    ({ mapConfig, layerId, sourceLayer }) => {
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
        if (hoveredFeatureId === null) {
          return
        }
        const row = data.find(r => r[mapConfig.foreignKey] === hoveredFeatureId)

        const popupNode = document.createElement('div')
        ReactDOM.render(
          <MapPopupContent
            id={row?.id}
            title={'Title'}
            metricName={metricData?.title}
            data={row[mapConfig.metricKey] ?? 0}
            colorScheme={colorSchemeReversed}
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

            const row = data.find(r => r[mapConfig.foreignKey] === e.features[0].id)

            const popupNode = document.createElement('div')
            ReactDOM.render(
              <MapPopupContent
                id={e.features[0].id}
                title={'Title'}
                metricName={metricData?.title}
                data={row[mapConfig.metricKey] ?? 0}
                colorScheme={colorSchemeReversed}
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
        if (popupExpanded) return

        if (hoveredFeatureId !== null) {
          popupExpanded = false
          map.current.setFeatureState(
            { source: sourceLayer, sourceLayer: sourceLayer, id: hoveredFeatureId },
            { hover: false },
          )
        }
        hoverPopup.remove().removeClassName('immobile')
        hoveredFeatureId = null
        clearTimeout(hoverPopupTimeout)
      })
    },
    [colorSchemeReversed, data, metricData?.title],
  )

  const updateMap = useCallback(() => {
    if (!metricData || !data?.length || !mapLoaded || !map.current) return

    const { geometry, layers } = metricData || {}

    layers.forEach(layer => {
      const paint = layer?.paint
      const sourceLayer = layer?.sourceLayer
      const beforeId = layer?.beforeId
      const fillsId = `regions-${sourceLayer}-fills`
      const linesId = `regions-${sourceLayer}-lines`
      const hoverId = `regions-${sourceLayer}-hover-outline`

      const mapConfig = createMapConfig({ metric: metricData, layer })

      // TODO: temp - add other types
      if (mapConfig.type !== 'chloropleth') return

      map.current.addSource(sourceLayer, geometry)

      // TODO: refactor
      const mergeData = data => {
        data.forEach(row => {
          if (row.hasOwnProperty(mapConfig.metricKey) && row[mapConfig.metricKey] !== null) {
            map.current.setFeatureState(
              {
                source: sourceLayer,
                sourceLayer: sourceLayer,
                id: row[mapConfig.foreignKey],
              },
              {
                [mapConfig.metricKey]: row[mapConfig.metricKey],
              },
            )
          }
        })
      }
      mergeData(data)

      if (paint?.default) {
        paint.default?.fill &&
          map.current.addLayer(
            {
              id: fillsId,
              type: 'fill',
              source: sourceLayer,
              'source-layer': sourceLayer,
              paint: {
                'fill-color': [
                  'case',
                  ['!=', ['feature-state', mapConfig.metricKey], null],
                  buildColorExpression(mapConfig),
                  ['to-color', mapConfig?.fill?.default?.fallbackColor],
                ],
                'fill-opacity': [
                  'case',
                  ['to-boolean', ['feature-state', 'hover']],
                  mapConfig?.fill?.hover?.opacity ?? mapConfig?.fill?.default?.opacity ?? 1.0,
                  mapConfig?.fill?.default?.opacity ?? 1.0,
                ],
              },
            },
            beforeId,
          )

        map.current.addLayer(
          {
            id: linesId,
            type: 'line',
            source: sourceLayer,
            'source-layer': sourceLayer,
            paint: {
              'line-color': ['to-color', mapConfig?.outline?.default?.color ?? '#000000'],
              'line-width': mapConfig?.outline?.default?.width ?? 1.0,
              'line-opacity': mapConfig?.outline?.default?.opacity ?? 1.0,
            },
          },
          beforeId,
        )

        paint.default?.fill &&
          (clearMapFunctionsList.current = [...clearMapFunctionsList.current, () => map.current.removeLayer(fillsId)])

        clearMapFunctionsList.current = [...clearMapFunctionsList.current, () => map.current.removeLayer(linesId)]
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
              'line-color': [
                'to-color',
                mapConfig?.outline?.hover?.color ?? mapConfig?.outline?.default?.color ?? '#000000',
              ],
              'line-width': mapConfig?.outline?.hover?.width ?? mapConfig?.outline?.default?.width ?? 1.0,
              'line-opacity': [
                'case',
                ['to-boolean', ['feature-state', 'hover']],
                mapConfig?.outline?.hover?.opacity ?? mapConfig?.outline?.default?.opacity ?? 1.0,
                0.0,
              ],
            },
          },
          beforeId,
        )

        clearMapFunctionsList.current = [...clearMapFunctionsList.current, () => map.current.removeLayer(hoverId)]

        initPopup({ mapConfig, layerId: fillsId, sourceLayer })
      }

      // remove source last as layers should be removed first
      clearMapFunctionsList.current = [...clearMapFunctionsList.current, () => map.current.removeSource(sourceLayer)]
    })
  }, [data, initPopup, mapLoaded, metricData])

  const cleanMap = useCallback(() => {
    ;(clearMapFunctionsList.current || []).forEach(func => {
      try {
        func()
      } catch (e) {
        console.log(e)
      }
    })

    clearMapFunctionsList.current = []
  }, [])

  // effects
  useEffect(() => {
    setSelectedMetric(config?.defaultMetric)
  }, [config?.defaultMetric])

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
    getData()
  }, [getData])

  return (
    <Box position={'absolute'} top={0} bottom={0} left={0} right={0}>
      <GlobalStyles styles={{ [`.${popupClassName}`]: popupContainerStyles }} />

      <div ref={mapContainer} id="map" className="map-container" style={{ height: '100%', width: '100%' }} />

      <Box
        position={'absolute'}
        zIndex={999}
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
          <SimpleRange value={60} min={0} max={100} style={'gradient'} colorScheme={colorSchemeReversed || []} />

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

export default Map
