import React, { useRef, useState } from 'react'
import Header from '../Header/Header.container'
import Sidebar from '../Sidebar'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { HeaderConfigType } from 'utils/propTypes'
import { HeaderContextProvider } from 'contexts/HeaderContext'

function Dashboard({ children, headerConfig, sx, ...otherProps }) {
  const containerRef = useRef()
  // TODO: move to Redux store
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Box sx={{ pt: theme => theme.components.header.height, ...(sx || {}) }} {...otherProps}>
      <HeaderContextProvider headerConfig={headerConfig}>
        <Header
          config={headerConfig}
          toggleSidebar={open => setSidebarOpen(open)}
          parentElement={containerRef?.current}
        />
        <Sidebar open={sidebarOpen} handleClose={() => setSidebarOpen(false)} />

        {children}
      </HeaderContextProvider>
    </Box>
  )
}

Dashboard.propTypes = {
  sx: PropTypes.any,
  noElevateBeforeScroll: PropTypes.bool,
  headerConfig: HeaderConfigType,
}

export default Dashboard
