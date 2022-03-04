import MapPopupContent from './MapPopupContent'

export default {
  title: 'components/MapPopupContent',
  component: MapPopupContent,
  argTypes: {},
}

const Template = args => <MapPopupContent {...args} />

export const Default = Template.bind({})
Default.args = {
  id: 'id',
  title: 'Title',
  metricName: 'Metric name',
  data: 0.75,
  colorScheme: ['#fff5eb', '#fd8d3c', '#7f2704'],
  colorSchemeDomain: [0, 0.3, 1],
  addToComparison: true,
}
