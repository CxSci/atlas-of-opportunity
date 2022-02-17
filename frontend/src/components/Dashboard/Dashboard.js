import React, { useRef, useState } from 'react'
import Header from '../Header/Header.container'
import Sidebar from '../Sidebar'

function Dashboard({ children }) {
  const containerRef = useRef()
  // TODO: move to Redux store
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Header toggleSidebar={open => setSidebarOpen(open)} parentElement={containerRef?.current} />
      <Sidebar open={sidebarOpen} handleClose={() => setSidebarOpen(false)} />

      {children}
    </>
  )
}

export default Dashboard
