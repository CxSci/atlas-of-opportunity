import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import { IntlProvider } from 'react-intl'

import Routes from '../../routes'
import initTheme from '../../utils/theme'
import { TempContext } from '../../contexts/AppTempContext'
import { getDatasetList } from 'store/modules/dataset'

function App() {
  // TODO: move to redux
  const dispatch = useDispatch()
  const [darkTheme, setDarkTheme] = useState(false)
  const theme = useMemo(() => initTheme(darkTheme), [darkTheme])
  useEffect(() => dispatch(getDatasetList()), [dispatch])

  return (
    <IntlProvider locale={navigator.language}>
      <ThemeProvider theme={theme}>
        <TempContext.Provider value={{ setDarkTheme }}>
          <Routes />
          <CssBaseline />
        </TempContext.Provider>
      </ThemeProvider>
    </IntlProvider>
  )
}

export default App
