import StackChart from './StackChart'

export default {
  title: 'components/StackChart',
  component: StackChart,
  argTypes: {},
}

const Template = args => <StackChart {...args} />

const stackDataForDefault = [
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

const stackDataForVariant = [
  { x: '2018-01-01', y: 2057.0, z: '2018' },
  { x: '2018-01-29', y: 3486.0, z: '2018' },
  { x: '2018-02-26', y: 3351.0, z: '2018' },
  { x: '2018-03-26', y: 4005.0, z: '2018' },
  { x: '2018-04-23', y: 4991.0, z: '2018' },
  { x: '2018-05-21', y: 4270.0, z: '2018' },
  { x: '2018-06-18', y: 4674.0, z: '2018' },
  { x: '2018-07-16', y: 5052.0, z: '2018' },
  { x: '2018-08-13', y: 3904.0, z: '2018' },
  { x: '2018-09-10', y: 4394.0, z: '2018' },
  { x: '2018-10-08', y: 4777.0, z: '2018' },
  { x: '2018-11-05', y: 5185.0, z: '2018' },
  { x: '2018-12-03', y: 5608.0, z: '2018' },
  { x: '2018-12-31', y: 4133.0, z: '2018' },
  { x: '2019-01-28', y: 4595.0, z: '2019' },
  { x: '2019-02-25', y: 4079.0, z: '2019' },
  { x: '2019-03-25', y: 3986.0, z: '2019' },
  { x: '2019-04-22', y: 3844.0, z: '2019' },
  { x: '2019-05-20', y: 3642.0, z: '2019' },
  { x: '2019-06-17', y: 3813.0, z: '2019' },
  { x: '2019-07-15', y: 3744.0, z: '2019' },
  { x: '2019-08-12', y: 3619.0, z: '2019' },
  { x: '2019-09-09', y: 4378.0, z: '2019' },
  { x: '2019-10-07', y: 3591.0, z: '2019' },
  { x: '2019-11-04', y: 3385.0, z: '2019' },
  { x: '2019-12-02', y: 4492.0, z: '2019' },
  { x: '2019-12-30', y: 4473.0, z: '2019' },
  { x: '2020-01-27', y: 4950.0, z: '2020' },
  { x: '2020-02-24', y: 3848.0, z: '2020' },
  { x: '2020-03-23', y: 1219.0, z: '2020' },
  { x: '2020-04-20', y: 1153.0, z: '2020' },
  { x: '2020-05-18', y: 1424.0, z: '2020' },
  { x: '2020-06-15', y: 1473.0, z: '2020' },
  { x: '2020-07-13', y: 1800.0, z: '2020' },
  { x: '2020-08-10', y: 1877.0, z: '2020' },
  { x: '2020-09-07', y: 1593.0, z: '2020' },
  { x: '2020-10-05', y: 1721.0, z: '2020' },
  { x: '2020-11-02', y: 1815.0, z: '2020' },
  { x: '2020-11-30', y: 1592.0, z: '2020' },
  { x: '2020-12-28', y: 1054.0, z: '2020' },
  { x: '2021-01-25', y: 1310.0, z: '2021' },
  { x: '2021-02-22', y: 1481.0, z: '2021' },
  { x: '2021-03-22', y: 1538.0, z: '2021' },
  { x: '2021-04-19', y: 1601.0, z: '2021' },
  { x: '2021-05-17', y: 1461.0, z: '2021' },
  { x: '2021-06-14', y: 1544.0, z: '2021' },
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
  data: stackDataForDefault,
}

export const WithTimeVariant = Template.bind({})
WithTimeVariant.args = {
  title: 'Projected Population',
  xAxis: {
    title: 'Year',
    format: 'date',
    dateFormat: {
      month: 'short',
      year: '2-digit',
    },
  },
  yAxis: {
    title: 'Business Count',
    format: 'number',
  },
  data: stackDataForVariant,
  variant: 'time',
}
