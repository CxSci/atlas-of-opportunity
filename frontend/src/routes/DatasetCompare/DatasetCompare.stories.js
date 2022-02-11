import React from 'react'

import PATH from '../../utils/path'
import DatasetCompare from './DatasetCompare'

export default {
  title: `routes/${PATH.COMPARISON}`,
  component: DatasetCompare,
  argTypes: {}
}

const Template = args => <DatasetCompare {...args} />

export const Default = Template.bind({})
