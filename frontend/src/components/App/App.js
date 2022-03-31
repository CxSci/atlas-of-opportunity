import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import { IntlProvider } from 'react-intl'

import Routes from 'routes'
import initTheme from 'utils/theme'
import { getDatasetList } from 'store/modules/dataset'

function App() {
  const dispatch = useDispatch()
  const theme = useMemo(() => initTheme('light'), []) // set light theme
  useEffect(() => dispatch(getDatasetList()), [dispatch])

  return (
    <IntlProvider locale={navigator.language}>
      <ThemeProvider theme={theme}>
        <Routes />
        <CssBaseline />
      </ThemeProvider>
    </IntlProvider>
  )
}

export default App
