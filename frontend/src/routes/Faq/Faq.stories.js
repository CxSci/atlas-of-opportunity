import React from 'react'

import PATH from '../../utils/path'
import Faq from './Faq'

export default {
  title: `routes${PATH.FAQ}`,
  component: Faq,
  argTypes: {}
}

const Template = args => <Faq {...args} />

export const Default = Template.bind({})
