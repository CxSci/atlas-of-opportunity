import React, { useMemo, useState } from 'react'
import Routes from '../../routes'
import Header from '../Header'
import Sidebar from '../Sidebar/Sidebar'
import AppContainer from './AppContainer'
import { ThemeProvider } from '@mui/material'
import initTheme from '../../utils/theme'
import CssBaseline from '@mui/material/CssBaseline'

function App() {
  // TODO: move to Redux store
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkTheme, setDarkTheme] = useState(false)

  const theme = useMemo(() => initTheme(darkTheme), [darkTheme])

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header toggleSidebar={open => setSidebarOpen(open)} />
        <Sidebar open={sidebarOpen} handleClose={() => setSidebarOpen(false)} />

        <Routes />
      </AppContainer>

      <CssBaseline />
    </ThemeProvider>
  )
}

export default App
