import React from 'react'

import PATH from '../../utils/path'
import Contributors from './Contributors'

export default {
  title: `routes/${PATH.CONTRIBUTORS}`,
  component: Contributors,
  argTypes: {}
}

const Template = args => <Contributors {...args} />

export const Default = Template.bind({})
