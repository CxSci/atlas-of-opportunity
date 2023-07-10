// Button.stories.js|jsx

import React from 'react'
import { ThemeProvider } from '@mui/material'

import AssistantMenu from './AssistantMenu'
import initTheme from '../../utils/theme'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'components/AssistantMenu',
  component: AssistantMenu,
  argTypes: {},
}

export const Primary = () => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <AssistantMenu primary>Primary</AssistantMenu>
    </ThemeProvider>
  )
}

// import AssistantMenu from './AssistantMenu'

// export default {
//   title: 'components/AssistantMenu',
//   component: AssistantMenu,
//   argTypes: {},
// }

// const Template = args => {
//   return <AssistantMenu
//     {...args}
//   />
// }

// export const Default = Template.bind({})
// Default.args = {}
