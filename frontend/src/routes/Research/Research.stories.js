import React from 'react'

import PATH from '../../utils/path'
import Research from './Research'

export default {
  title: `routes/${PATH.RESEARCH}`,
  component: Research,
  argTypes: {}
}

const Template = args => <Research {...args} />

export const Default = Template.bind({})
