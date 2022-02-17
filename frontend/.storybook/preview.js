import 'styles/index.scss'
import { addDecorator } from '@storybook/react'
import { MemoryRouter } from 'react-router'
import { IntlProvider } from 'react-intl'
import { ThemeProvider } from '@mui/material'

import initTheme from '../src/utils/theme'

addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

const withProviders = (Story, context) => {
  const theme = initTheme(false)
  return (
    <IntlProvider locale={navigator.language}>
      <ThemeProvider theme={theme}>
        <Story {...context} />
      </ThemeProvider>
    </IntlProvider>
  )
}

export const decorators = [withProviders]
