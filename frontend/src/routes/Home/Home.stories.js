import React from 'react'

import Home from './Home'

export default {
  title: 'routes/Home',
  component: Home,
  argTypes: {}
}

const Template = args => <Home {...args} />

export const Default = Template.bind({})
