import React from 'react'
import { ThemeProvider } from '@mui/material'

import initTheme from 'utils/theme'
import PATH from '../../utils/path'
import GuidedTool from './GuidedTool'

export default {
  title: `routes${PATH.GUIDED_TOOL}`,
  component: GuidedTool,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <GuidedTool {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
