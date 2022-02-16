import React, { useMemo, useRef, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'

import Routes from '../../routes'
import Header from '../Header'
import Sidebar from '../Sidebar'
import AppContainer from './AppContainer'
import initTheme from '../../utils/theme'

function App() {
  const containerRef = useRef()

  // TODO: move to Redux store
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkTheme, setDarkTheme] = useState(false)

  const theme = useMemo(() => initTheme(darkTheme), [darkTheme])

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header toggleSidebar={open => setSidebarOpen(open)} parentElement={containerRef?.current} />
        <Sidebar open={sidebarOpen} handleClose={() => setSidebarOpen(false)} />

        <Routes />
      </AppContainer>

      <CssBaseline />
    </ThemeProvider>
  )
}

export default App
