import React, { useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import { IntlProvider } from 'react-intl'

import Routes from '../../routes'
import AppContainer from './AppContainer'
import initTheme from '../../utils/theme'

function App() {
  const darkTheme = true
  const theme = useMemo(() => initTheme(darkTheme), [darkTheme])

  return (
    <IntlProvider locale={navigator.language}>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <Routes />
        </AppContainer>

        <CssBaseline />
      </ThemeProvider>
    </IntlProvider>
  )
}

export default App
