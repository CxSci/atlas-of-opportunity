import React from 'react'
import { ThemeProvider } from '@mui/material'

import Anchor from './Anchor'
import initTheme from '../../utils/theme'
import { HeaderContextProvider } from '../../contexts/HeaderContext'

export default {
  title: 'components/Anchor',
  component: Anchor,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  const customScrolledHeight = 80
  const top = customScrolledHeight + theme.components?.SectionNavbar?.height + parseFloat(theme.spacing(2))
  return (
    <ThemeProvider theme={theme}>
      <HeaderContextProvider headerConfig={{ customScrolledHeight }}>
        <div style={{ paddingTop: top }}>
          <Anchor {...args} />
          <h2>Heading starts here</h2>
          <p>But the anchor points to {top}px above the heading to make space for header and navigation bar.</p>
        </div>
      </HeaderContextProvider>
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  htmlId: 'test',
}
