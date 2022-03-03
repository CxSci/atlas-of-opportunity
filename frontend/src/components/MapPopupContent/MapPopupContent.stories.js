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
  colorScheme: ['#7f2704', '#fd8d3c', '#fff5eb'],
  addToComparison: true,
}
