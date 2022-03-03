import LineChart from './LineChart'

export default {
  title: 'components/LineChart',
  component: LineChart,
  argTypes: {},
}

const Template = args => <LineChart {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Projected Population',
  xAxis: {
    title: 'Year',
  },
  yAxis: {
    title: 'Population',
    format: 'number',
  },
  data: [
    { x: '2016', y: 16285 },
    { x: '2021', y: 20354 },
    { x: '2026', y: 22882 },
    { x: '2031', y: 25849 },
    { x: '2036', y: 29148 },
  ],
}
