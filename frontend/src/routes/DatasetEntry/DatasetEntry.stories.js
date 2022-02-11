import React from 'react'

import PATH from '../../utils/path'
import DatasetEntry from './DatasetEntry'

export default {
  title: `routes/${PATH.DATASET_ENTRY}`,
  component: DatasetEntry,
  argTypes: {}
}

const Template = args => <DatasetEntry {...args} />

export const Default = Template.bind({})
