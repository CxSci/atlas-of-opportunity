import React from 'react'
import { ThemeProvider } from '@mui/material'

import Anchor from '../Anchor'
import SectionNavbar from './SectionNavbar'
import initTheme from '../../utils/theme'
import { HeaderContextProvider } from '../../contexts/HeaderContext'
import { slugify } from 'utils/helpers'

export default {
  title: 'components/SectionNavbar',
  component: SectionNavbar,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme(false)
  const customScrolledHeight = 80
  const top = customScrolledHeight + theme.components?.SectionNavbar?.height + parseFloat(theme.spacing(2))
  return (
    <ThemeProvider theme={theme}>
      <HeaderContextProvider headerConfig={{ customScrolledHeight }}>
        <div style={{ paddingTop: top }}>
          <SectionNavbar {...args} />
          {args.sections.map((section, index) => {
            const sectionId = slugify(section.title)
            return (
              <div key={index} data-scrollspy={sectionId} style={{ height: '90vh' }}>
                <Anchor htmlId={sectionId} />
                <h2>{section.title}</h2>
              </div>
            )
          })}
        </div>
      </HeaderContextProvider>
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  sections: [
    { title: 'Section 1' },
    { title: 'Section 2' },
    { title: 'Section 3' },
    { title: 'Section 4' },
    { title: 'Section 5' },
    { title: 'Section 6' },
  ],
}
