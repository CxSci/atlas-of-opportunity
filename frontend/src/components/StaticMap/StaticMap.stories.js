import Box from '@mui/material/Box'

import StaticMap from './StaticMap'
import GeoJSON from 'mocked_api_responses/geo'

export default {
  title: 'components/StaticMap',
  component: StaticMap,
}

const DetailPageTemplate = args => <StaticMap {...args} />
const HeaderMapTemplate = args => (
  <Box sx={{ width: 64 }}>
    <StaticMap {...args} />
  </Box>
)
const ComparisonPageTemplate = args => (
  <Box sx={{ width: 290 }}>
    <StaticMap {...args} />
  </Box>
)

export const DetailPage = DetailPageTemplate.bind({})
DetailPage.args = {
  geoJSON: GeoJSON,
  square: false,
  height: 400,
  areaId: '401011001',
}

export const HeaderMap = HeaderMapTemplate.bind({})
HeaderMap.args = {
  geoJSON: GeoJSON,
  square: true,
  areaId: '401011001',
}

export const ComparisonPage = ComparisonPageTemplate.bind({})
ComparisonPage.args = {
  geoJSON: GeoJSON,
  square: true,
  areaId: '401011001',
}
