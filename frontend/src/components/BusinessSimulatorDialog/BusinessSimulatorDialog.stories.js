// Button.stories.js|jsx

import React from 'react'
import { ThemeProvider } from '@mui/material'

import BusinessSimulatorDialog from './BusinessSimulatorDialog'
import initTheme from '../../utils/theme'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'components/BusinessSimulatorDialog',
  component: BusinessSimulatorDialog,
  argTypes: {},
}

// disabled
export const Initial = () => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <BusinessSimulatorDialog primary>Primary</BusinessSimulatorDialog>
    </ThemeProvider>
  )
}

// each partially filled state

// fully filled in

// started

// import BusinessSimulatorDialog from './BusinessSimulatorDialog'

// export default {
//   title: 'components/BusinessSimulatorDialog',
//   component: BusinessSimulatorDialog,
//   argTypes: {},
// }

// const Template = args => {
//   return <BusinessSimulatorDialog
//     {...args}
//   />
// }

// export const Default = Template.bind({})
// Default.args = {}
