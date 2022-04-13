import React from 'react'
import { ThemeProvider } from '@mui/material'

import initTheme from 'utils/theme'
import PATH from '../../utils/path'
import Faq from './Faq'

export default {
  title: `routes${PATH.FAQ}`,
  component: Faq,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <Faq {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
