import React from 'react'
import { ThemeProvider } from '@mui/material'

import Home from './Home'
import initTheme from 'utils/theme'

export default {
  title: 'routes/Home',
  component: Home,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <Home {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
