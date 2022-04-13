import { ThemeProvider } from '@mui/material'

import MapPopupContent from './MapPopupContent'
import initTheme from 'utils/theme'

export default {
  title: 'components/MapPopupContent',
  component: MapPopupContent,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <MapPopupContent {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  id: 'id',
  title: 'Title',
  metricName: 'Metric name',
  data: 0.75,
  colorScheme: ['#fff5eb', '#fd8d3c', '#7f2704'],
  domain: [0, 0.3, 1],
  expanded: true,
}
