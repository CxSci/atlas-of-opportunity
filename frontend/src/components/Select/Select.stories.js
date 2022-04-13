import { ThemeProvider } from '@mui/material'

import Select from './Select'
import initTheme from 'utils/theme'

export default {
  title: 'components/Select',
  component: Select,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <Select {...args} />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  options: [
    { id: 'option-1', title: 'Option 1' },
    { id: 'option-2', title: 'Option 2' },
    { id: 'option-3', title: 'Option 3' },
  ],
  label: 'Select',
  labelId: 'select-story-example-label',
  hasEmptyOption: true,
}
