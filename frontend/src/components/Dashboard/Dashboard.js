import React, { useRef, useState } from 'react'
import Header from '../Header/Header.container'
import Sidebar from '../Sidebar'
import PropTypes from 'prop-types'

function Dashboard({ children, headerConfig }) {
  const containerRef = useRef()
  // TODO: move to Redux store
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Header
        config={headerConfig}
        toggleSidebar={open => setSidebarOpen(open)}
        parentElement={containerRef?.current}
      />
      <Sidebar open={sidebarOpen} handleClose={() => setSidebarOpen(false)} />

      {children}
    </>
  )
}

Dashboard.propTypes = {
  headerConfig: PropTypes.shape({
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
