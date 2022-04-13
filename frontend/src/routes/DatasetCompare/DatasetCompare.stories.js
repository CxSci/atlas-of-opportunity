import React from 'react'
import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'

import initTheme from 'utils/theme'
import PATH from '../../utils/path'
import DatasetCompare from './DatasetCompare'
import store from 'store'

export default {
  title: `routes${PATH.COMPARISON}`,
  component: DatasetCompare,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DatasetCompare {...args} />
      </ThemeProvider>
    </Provider>
  )
}

export const Default = Template.bind({})
