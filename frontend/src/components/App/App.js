import React, { useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'

import Routes from '../../routes'
import AppContainer from './AppContainer'
import initTheme from '../../utils/theme'

function App() {
  const darkTheme = true
  const theme = useMemo(() => initTheme(darkTheme), [darkTheme])

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Routes />
      </AppContainer>

      <CssBaseline />
    </ThemeProvider>
  )
}

export default App
