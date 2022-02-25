const nFormatterLookup = [
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'K' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' },
  { value: 1e18, symbol: 'E' },
]

export const nFormatter = (num, fractions = 1) => {
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = nFormatterLookup
    .slice()
    .reverse()
    .find(item => num >= item.value)
  return item ? (num / item.value).toFixed(fractions).replace(rx, '$1') + item.symbol : '0'
}
