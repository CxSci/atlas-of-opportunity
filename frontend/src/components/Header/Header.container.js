import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './Header'
import { SHOW_SCROLLED_HEADER_HEIGHT } from '../../utils/constants'

function HeaderContainer({ toggleSidebar }) {
  const [windowScroll, setWindowScroll] = useState(window.scrollY)
  const pageScrolled = useMemo(() => windowScroll > SHOW_SCROLLED_HEADER_HEIGHT, [windowScroll])

  const onScroll = useCallback(e => {
    setWindowScroll(window.scrollY)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} fixed hide={!pageScrolled} />
    </>
  )
}

export default HeaderContainer
