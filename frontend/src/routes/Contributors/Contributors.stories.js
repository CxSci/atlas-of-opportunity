import React from 'react'
import { ThemeProvider } from '@mui/material'

import initTheme from 'utils/theme'
import PATH from 'utils/path'
import Contributors from './Contributors'

export default {
  title: `routes${PATH.CONTRIBUTORS}`,
  component: Contributors,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <Contributors {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
