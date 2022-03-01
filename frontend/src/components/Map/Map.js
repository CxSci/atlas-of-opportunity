import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Box } from '@mui/material'


mapboxgl.accessToken =
  'pk.eyJ1IjoianVzdGluYW5kZXJzb24iLCJhIjoiY2tjYW10aWpxMXd1eDMwcW83OTkxNHpxNCJ9.fDQRr2Ctj4skAatc3pZ8VA'

function Map({ config }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const clearMapFunctionsList = useRef([])
  const [selectedMetric, setSelectedMetric] = useState(null)
  const [data, setData] = useState([])
  const [mapLoaded, setMapLoaded] = useState(false)

  const metricData = useMemo(
    () => (config?.metrics || [])?.find(item => item?.id === selectedMetric),
    [config?.metrics, selectedMetric],
  )

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

  const updateMap = useCallback(() => {
    if (!metricData || !data?.length || !mapLoaded) return
    // console.log(map.current)

    let hoverPopupTimeout = null
    const hoverPopup = new mapboxgl.Popup({
      anchor: 'top',
      closeButton: false,
      closeOnClick: false,
      className: 'floating-popup',
      offset: [0, 10],
      maxWidth: 'none',
    })

    const buildColorExpression = ({ fill, metricKey, domain, ...options }) => {
      const result = []
      switch (fill.default.scale) {
        case 'step':
          result.push('step')
          break
        case 'linear':
        default:
          result.push('interpolate', ['linear'])
      }

      result.push(['feature-state', metricKey])

      // Build alternating list of numbers and colors
      if (fill.default.scale === 'step') {
        result.push(['to-color', fill.default.colorScheme.shift()])
      }
      fill.default.colorScheme.forEach((color, i) => {
        result.push(domain[i], ['to-color', color])
      })
      return result
    }

    let hoveredFeatureId = null

    const { geometry, layers } = metricData || {}

    layers.forEach(layer => {
      const paint = layer?.paint
      const sourceLayer = layer?.sourceLayer
      const beforeId = layer?.beforeId
      const fillsId = `regions-${sourceLayer}-fills`
      const linesId = `regions-${sourceLayer}-lines`
      const hoverId = `regions-${sourceLayer}-hover-outline`

      let mapConfig = {
        foreignKey: 'id',
        metricKey: 'data',
        type: metricData?.type,
        domain: layer?.metric?.domain,
        fill: {
          default: {
            scale: layer?.metric?.scale,
            colorScheme: layer?.paint?.default?.fill?.colorScheme,
            fallbackColor: layer?.paint?.default?.fill?.fallbackColor,
            opacity: layer?.paint?.default?.fill?.opacity ?? 1.0,
          },
          hover: {
            opacity: layer?.paint?.hover?.fill?.opacity ?? 1.0,
          },
        },
        outline: {
          default: {
            color: layer?.paint?.default?.outline?.color,
            width: layer?.paint?.default?.outline?.width,
            opacity: layer?.paint?.default?.outline?.opacity ?? 1.0,
          },
          hover: {
            width: layer?.paint?.hover?.outline?.width ?? 1.0,
            opacity: layer?.paint?.hover?.outline?.opacity ?? 1.0,
          },
        },
      }

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

        // TODO: fix popup
        const expandPopup = html => {
          if (hoveredFeatureId === null) {
            return
          }
          const row = data.find(r => r[mapConfig.foreignKey] === hoveredFeatureId)
          html = `${row.sa2_name16} -><br/>${row[mapConfig.metricKey] ?? 'n/a'}`
          html += '<br/>Add to Comparison'
          hoverPopup.setHTML(html).addClassName('immobile')
        }

        map.current.on('mousemove', fillsId, e => {
          if (e.features.length > 0) {
            if (hoveredFeatureId !== e.features[0].id) {
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
              const html = `${row.sa2_name16}<br/>${row[mapConfig.metricKey] ?? 'n/a'}`
              hoverPopup.setHTML(html).addTo(map).removeClassName('immobile')
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
            //
            //    This code doesn't include that freeze/unfreeze bit.
            clearTimeout(hoverPopupTimeout)
            hoverPopupTimeout = setTimeout(expandPopup, 700)
          }
        })

        map.current.on('mouseleave', fillsId, () => {
          if (hoveredFeatureId !== null) {
            map.current.setFeatureState(
              { source: sourceLayer, sourceLayer: sourceLayer, id: hoveredFeatureId },
              { hover: false },
            )
          }
          hoverPopup.remove().removeClassName('immobile')
          hoveredFeatureId = null
          clearTimeout(hoverPopupTimeout)
        })
      }

      // remove source last as layers should be removed first
      clearMapFunctionsList.current = [...clearMapFunctionsList.current, () => map.current.removeSource(sourceLayer)]
    })
  }, [data, mapLoaded, metricData])

  const cleanMap = useCallback(() => {
    ;(clearMapFunctionsList.current || []).forEach(func => func())

    clearMapFunctionsList.current = []
  }, [])

  // effects
  useEffect(() => {
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
  }, [config, data, metricData])

  useEffect(() => {
    setSelectedMetric(config?.defaultMetric)
  }, [config?.defaultMetric])

  useEffect(() => {
    updateMap()

    return () => cleanMap()
  }, [cleanMap, updateMap])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <Box position={'absolute'} top={0} bottom={0} left={0} right={0}>
      <div ref={mapContainer} id="map" className="map-container" style={{ height: '100%', width: '100%' }} />

      {/* TODO: replace with real floating select block */}
      <Box position={'absolute'} zIndex={999} bottom={40} left={20} bgcolor={'#fff'} p={1} borderRadius={1}>
        <select name="metric" onChange={e => setSelectedMetric(e?.target?.value)}>
          {(config?.metrics || []).map(metric => (
            <option key={metric?.id} value={metric?.id}>
              {metric?.title}
            </option>
          ))}
        </select>
      </Box>
    </Box>
  )
}

export default Map
