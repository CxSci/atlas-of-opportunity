import React, { useMemo, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import { IntlProvider } from 'react-intl'

import Routes from '../../routes'
import initTheme from '../../utils/theme'
import { TempContext } from '../../utils/AppTempContext'

function App() {
  // TODO: move to redux
  const [darkTheme, setDarkTheme] = useState(false)
  const theme = useMemo(() => initTheme(darkTheme), [darkTheme])

  return (
    <IntlProvider locale={navigator.language}>
      <ThemeProvider theme={theme} setDarkTheme={setDarkTheme}>
        <TempContext.Provider value={{ setDarkTheme }}>
          <Routes />

          <CssBaseline />
        </TempContext.Provider>
      </ThemeProvider>
    </IntlProvider>
  )
}

export default App
