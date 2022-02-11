import React from 'react'

import PATH from '../../utils/path'
import Dataset from './Dataset'

export default {
  title: `routes/${PATH.DATASET}`,
  component: Dataset,
  argTypes: {}
}

const Template = args => <Dataset {...args} />

export const Default = Template.bind({})
