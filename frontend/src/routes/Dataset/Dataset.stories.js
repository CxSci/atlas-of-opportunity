import React from 'react'
import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'

import initTheme from 'utils/theme'
import PATH from '../../utils/path'
import Dataset from './Dataset'
import store from 'store'

export default {
  title: `routes${PATH.DATASET}`,
  component: Dataset,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Dataset {...args} />
      </ThemeProvider>
    </Provider>
  )
}

export const Default = Template.bind({})
