import { ThemeProvider } from '@mui/material'

import MetricFilters from './MetricFilters'
import initTheme from 'utils/theme'

export default {
  title: 'components/MetricFilters',
  component: MetricFilters,
  argTypes: {},
  parameters: { actions: { argTypesRegex: '^on.*' } },
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <MetricFilters {...args} />
    </ThemeProvider>
  )
}

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
