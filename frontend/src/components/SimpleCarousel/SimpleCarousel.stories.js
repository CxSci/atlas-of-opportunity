import { useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'

import SimpleCarousel from './SimpleCarousel'
import initTheme from '../../utils/theme'

export default {
  title: 'components/SimpleCarousel',
  component: SimpleCarousel,
  argTypes: {},
}

const Template = args => {
  const { value: initialValue, items } = args
  const [value, setValue] = useState(initialValue)
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <SimpleCarousel value={value}>
        {items.map((item, index) => {
          return (
            <SimpleCarousel.Item
              key={index}
              value={item.value}
              sx={{
                mx: 2,
                '&:first-of-type': {
                  ml: 0,
                },
                '&:last-of-type': {
                  mr: 0,
                },
              }}>
              <Box sx={{ border: 1, px: 2 }} onClick={() => setValue(item.value)}>
                {item.value}
              </Box>
            </SimpleCarousel.Item>
          )
        })}
      </SimpleCarousel>
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  value: 'Item#1',
  items: [
    { value: 'Item#1' },
    { value: 'Item#2' },
    { value: 'Item#3' },
    { value: 'Item#4' },
    { value: 'Item#5' },
    { value: 'Item#6' },
    { value: 'Item#7' },
    { value: 'Item#8' },
    { value: 'Item#9' },
    { value: 'Item#10' },
    { value: 'Item#11' },
    { value: 'Item#12' },
    { value: 'Item#13' },
    { value: 'Item#14' },
    { value: 'Item#15' },
  ],
}
