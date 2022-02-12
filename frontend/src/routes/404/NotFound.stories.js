import React from 'react'

import PATH from '../../utils/path'
import NotFound from './NotFound'

export default {
  title: `routes${PATH[404]}`,
  component: NotFound,
  argTypes: {}
}

const Template = args => <NotFound {...args} />

export const Default = Template.bind({})
