import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import Header from './Header'
import { SHOW_SCROLLED_HEADER_HEIGHT } from '../../utils/constants'

function HeaderContainer({ toggleSidebar, config }) {
  // hooks
  const navigate = useNavigate()

  // state
  const [pageScrolled, setPageScrolled] = useState(false)

  // vars
  const { backRoute, content, contentScrolled, leftContainerProps, customScrolledHeight, shadowOnScroll } = useMemo(
    () => config || {},
    [config],
  )

  // methods
  const onScroll = useCallback(() => {
    setPageScrolled(window.scrollY > SHOW_SCROLLED_HEADER_HEIGHT)
  }, [])

  // effects
  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  // Call scroll callback on page load to ensure `pageScrolled` is accurate.
  // Firefox and Safari report `window.scrollY` as 0 on page load and don't fire
  // an initial scroll event even if the page is already scrolled due to a reload
  // or a URL hash.
  useEffect(() => {
    onScroll()
  }, [onScroll])

  return (
    <Header
      toggleSidebar={toggleSidebar}
      scrolled={pageScrolled}
      navigate={navigate}
      backRoute={backRoute}
      content={content}
      shadowOnScroll={shadowOnScroll}
      contentScrolled={contentScrolled}
      leftContainerProps={leftContainerProps}
      customScrolledHeight={customScrolledHeight}
    />
  )
}

export default HeaderContainer
