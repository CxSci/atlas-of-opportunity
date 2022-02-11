import React from 'react'

import PATH from '../../utils/path'
import GuidedTool from './GuidedTool'

export default {
  title: `routes/${PATH.GUIDED_TOOL}`,
  component: GuidedTool,
  argTypes: {}
}

const Template = args => <GuidedTool {...args} />

export const Default = Template.bind({})
