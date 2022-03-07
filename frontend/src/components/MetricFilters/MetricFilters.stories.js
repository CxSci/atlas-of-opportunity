import MetricFilters from './MetricFilters'

export default {
  title: 'components/MetricFilters',
  component: MetricFilters,
  argTypes: {},
  parameters: { actions: { argTypesRegex: '^on.*' } },
}

const Template = args => <MetricFilters {...args} />

export const Default = Template.bind({})
Default.args = {
  onChange: values => {
    console.log(values)
  },
  filterValues: { year: '2019' },
  filters: [
    {
      key: 'year',
      control: 'select',
      title: 'Year',
      default_value: '2019',
    },
  ],
  data: [
    {
      anzsic: 'Accommodation and Food Services',
      year: '2017',
      value: 684,
    },
    {
      anzsic: 'Accommodation and Food Services',
      year: '2018',
      value: 713,
    },
    {
      anzsic: 'Accommodation and Food Services',
      year: '2019',
      value: 723,
    },
    {
      anzsic: 'Accommodation and Food Services',
      year: '2020 Predicted',
      value: 745,
    },
  ],
}
