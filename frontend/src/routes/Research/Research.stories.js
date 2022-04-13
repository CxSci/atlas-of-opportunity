import React from 'react'
import { ThemeProvider } from '@mui/material'

import initTheme from 'utils/theme'
import PATH from '../../utils/path'
import Research from './Research'

export default {
  title: `routes${PATH.RESEARCH}`,
  component: Research,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <Research {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
