import React from 'react'
import { ThemeProvider } from '@mui/material'

import initTheme from 'utils/theme'
import PATH from '../../utils/path'
import NotFound from './NotFound'

export default {
  title: `routes${PATH[404]}`,
  component: NotFound,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <NotFound {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
