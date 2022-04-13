import { Fragment } from 'react'
import { ThemeProvider } from '@mui/material'

import ExpandableContainer from './ExpandableContainer'
import initTheme from 'utils/theme'

export default {
  title: 'components/ExpandableContainer',
  component: ExpandableContainer,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <ExpandableContainer {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  data: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7'],
  children: items => items.map((item, index) => <div key={index}>{item}</div>),
}

export const WithFilters = Template.bind({})
WithFilters.args = {
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
    {
      anzsic: 'Health Care and Social Assistance',
      year: '2017',
      value: 659,
    },
    {
      anzsic: 'Health Care and Social Assistance',
      year: '2018',
      value: 661,
    },
    {
      anzsic: 'Health Care and Social Assistance',
      year: '2019',
      value: 681,
    },
    {
      anzsic: 'Health Care and Social Assistance',
      year: '2020 Predicted',
      value: 689,
    },
    {
      anzsic: 'Manufacturing',
      year: '2017',
      value: 244,
    },
    {
      anzsic: 'Manufacturing',
      year: '2018',
      value: 223,
    },
    {
      anzsic: 'Manufacturing',
      year: '2019',
      value: 217,
    },
    {
      anzsic: 'Manufacturing',
      year: '2020 Predicted',
      value: 200,
    },
    {
      anzsic: 'Information Media and Telecommunications',
      year: '2017',
      value: 112,
    },
    {
      anzsic: 'Information Media and Telecommunications',
      year: '2018',
      value: 116,
    },
    {
      anzsic: 'Information Media and Telecommunications',
      year: '2019',
      value: 113,
    },
    {
      anzsic: 'Information Media and Telecommunications',
      year: '2020 Predicted',
      value: 114,
    },
    {
      anzsic: 'Electricity, Gas, Water and Waste Services',
      year: '2017',
      value: 18,
    },
    {
      anzsic: 'Electricity, Gas, Water and Waste Services',
      year: '2018',
      value: 16,
    },
    {
      anzsic: 'Electricity, Gas, Water and Waste Services',
      year: '2019',
      value: 23,
    },
    {
      anzsic: 'Electricity, Gas, Water and Waste Services',
      year: '2020 Predicted',
      value: 24,
    },
    {
      anzsic: 'Professional, Scientific and Technical Services',
      year: '2017',
      value: 1802,
    },
    {
      anzsic: 'Professional, Scientific and Technical Services',
      year: '2018',
      value: 1833,
    },
    {
      anzsic: 'Professional, Scientific and Technical Services',
      year: '2019',
      value: 1863,
    },
    {
      anzsic: 'Professional, Scientific and Technical Services',
      year: '2020 Predicted',
      value: 0,
    },
  ],
  children: items => (
    <dl>
      {items.map((item, index) => (
        <Fragment key={index}>
          <dt>{item.anzsic}</dt>
          <dd>{item.value}</dd>
        </Fragment>
      ))}
    </dl>
  ),
}
