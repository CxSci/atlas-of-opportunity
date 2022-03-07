import FilterSelect from './FilterSelect'

export default {
  title: 'components/FilterSelect',
  component: FilterSelect,
  argTypes: {},
  parameters: { actions: { argTypesRegex: '^on.*' } },
}

const Template = args => <FilterSelect {...args} />

export const Default = Template.bind({})
Default.args = {
  onChange: (key, value) => {
    console.log({ key, value })
  },
  value: '2019',
  filter: {
    key: 'year',
    control: 'select',
    title: 'Year',
    default_value: '2019',
  },
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
