import React from 'react'

import AppLogo from './AppLogo'

export default {
  title: 'components/AppLogo',
  component: AppLogo,
  argTypes: {}
}

const Template = args => <AppLogo {...args} />

export const Default = Template.bind({})
