import StackChart from './StackChart'

export default {
  title: 'components/StackChart',
  component: StackChart,
  argTypes: {},
}

const Template = args => <StackChart {...args} />

const stackData = [
  {
    x: '2017',
    y: 684,
    z: 'Accommodation and Food Services',
  },
  {
    x: '2018',
    y: 713,
    z: 'Accommodation and Food Services',
  },
  {
    x: '2019',
    y: 723,
    z: 'Accommodation and Food Services',
  },
  {
    x: '2020 Predicted',
    y: 745,
    z: 'Accommodation and Food Services',
  },
  {
    x: '2017',
    y: 659,
    z: 'Health Care and Social Assistance',
  },
  {
    x: '2018',
    y: 661,
    z: 'Health Care and Social Assistance',
  },
  {
    x: '2019',
    y: 681,
    z: 'Health Care and Social Assistance',
  },
  {
    x: '2020 Predicted',
    y: 689,
    z: 'Health Care and Social Assistance',
  },
  {
    x: '2017',
    y: 244,
    z: 'Manufacturing',
  },
  {
    x: '2018',
    y: 223,
    z: 'Manufacturing',
  },
  {
    x: '2019',
    y: 217,
    z: 'Manufacturing',
  },
  {
    x: '2020 Predicted',
    y: 200,
    z: 'Manufacturing',
  },
  {
    x: '2017',
    y: 112,
    z: 'Information Media and Telecommunications',
  },
  {
    x: '2018',
    y: 116,
    z: 'Information Media and Telecommunications',
  },
  {
    x: '2019',
    y: 113,
    z: 'Information Media and Telecommunications',
  },
  {
    x: '2020 Predicted',
    y: 114,
    z: 'Information Media and Telecommunications',
  },
  {
    x: '2017',
    y: 18,
    z: 'Electricity, Gas, Water and Waste Services',
  },
  {
    x: '2018',
    y: 16,
    z: 'Electricity, Gas, Water and Waste Services',
  },
  {
    x: '2019',
    y: 23,
    z: 'Electricity, Gas, Water and Waste Services',
  },
  {
    x: '2020 Predicted',
    y: 24,
    z: 'Electricity, Gas, Water and Waste Services',
  },
]

export const Default = Template.bind({})
Default.args = {
  title: 'Projected Population',
  xAxis: {
    title: 'Year',
  },
  yAxis: {
    title: 'Business Count',
    format: 'number',
  },
  data: stackData,
}
