export const SHOW_SCROLLED_HEADER_HEIGHT = 20

export const EXPANDABLE_MINIMUM_ITEMS = 5

export const DATASETS_MAP = {
  'small-business': {
    name: 'Small Business Support',
    searchPlaceholder: 'Search by region or suburb',
    darkTheme: true,
    entriesMap: {
      dataset: {
        name: 'Entry 1',
        path: 'entry-1',
        headerScrolledLeftContent: 'minimap',
      },
      entry2: {
        name: 'Entry 2',
        path: 'entry-2',
      },
    },
  },
  occupations: {
    name: 'Occupations',
    searchPlaceholder: 'Search by occupation',
    entriesMap: {
      dataset: {
        name: 'Entry 1',
        path: 'entry-1',
      },
      entry2: {
        name: 'Entry 2',
        path: 'entry-2',
      },
    },
  },
}

export const MAPBOX_API_KEY =
  'pk.eyJ1IjoianVzdGluYW5kZXJzb24iLCJhIjoiY2tjYW10aWpxMXd1eDMwcW83OTkxNHpxNCJ9.fDQRr2Ctj4skAatc3pZ8VA'

export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/'
