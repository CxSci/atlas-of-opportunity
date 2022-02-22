import React, { useRef, useState } from 'react'
import Header from '../Header/Header.container'
import Sidebar from '../Sidebar'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'

function Dashboard({ children, headerConfig, sx, ...otherProps }) {
  const containerRef = useRef()
  // TODO: move to Redux store
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Box sx={{ pt: theme => theme.components.header.height, ...(sx || {}) }} {...otherProps}>
      <Header
        config={headerConfig}
        toggleSidebar={open => setSidebarOpen(open)}
        parentElement={containerRef?.current}
      />
      <Sidebar open={sidebarOpen} handleClose={() => setSidebarOpen(false)} />

      {children}
    </Box>
  )
}

Dashboard.propTypes = {
  sx: PropTypes.any,
  noElevateBeforeScroll: PropTypes.bool,
  headerConfig: PropTypes.shape({
    customScrolledHeight: PropTypes.string,
    leftContainerProps: PropTypes.object,
    backRoute: PropTypes.string,
    content: PropTypes.shape({
      left: PropTypes.element,
      center: PropTypes.element,
      right: PropTypes.element,
    }),
    contentScrolled: PropTypes.shape({
      left: PropTypes.element,
      center: PropTypes.element,
      right: PropTypes.element,
    }),
  }),
}

export default Dashboard
