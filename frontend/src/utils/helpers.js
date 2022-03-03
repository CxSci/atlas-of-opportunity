/**
 * @param fill
 * @param  metricKey {string}
 * @param domain
 * @param options
 * @return {*[]}
 */
export function buildColorExpression({ fill, metricKey, domain, ...options }) {
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

/**
 * @param metric
 * @param layer
 * @return {{outline: {hover: {width: (*|number), opacity: (*|number)}, default: {color: *, width: *, opacity: (*|number)}}, metricKey: string, domain: (number[]|string|DeclarationDomain|UsageDomain|*), type: *, fill: {hover: {opacity: (*|number)}, default: {fallbackColor: (string|*), scale: *, opacity: (*|number), colorScheme: any}}, foreignKey: string}}
 */
export function createMapConfig({ metric, layer }) {
  return {
    foreignKey: 'id',
    metricKey: 'data',
    type: metric?.type,
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
}
