import { useEffect, useLayoutEffect, useState } from 'react'

const isInViewPort = (idEl, containerEl) => {
  const idRect = idEl.getBoundingClientRect()
  const containerRect = containerEl.getBoundingClientRect()
  if (idRect.top <= window.innerHeight / 2 || Math.round(containerRect.bottom) <= window.innerHeight) {
    return true
  } else {
    return false
  }
}

export const useScrollSpy = ({ onScroll }) => {
  const [userScroll, setUserScroll] = useState(false)
  // Credits:
  // https://stackoverflow.com/questions/7035896/detect-whether-scroll-event-was-created-by-user
  useEffect(() => {
    const handleKeyDown = event => {
      if (
        event.which === 33 || // page up
        event.which === 34 || // page dn
        event.which === 32 || // spacebar
        event.which === 38 || // up
        event.which === 40 || // down
        (event.ctrlKey && event.which === 36) || // ctrl + home
        (event.ctrlKey && event.which === 35) // ctrl + end
      ) {
        setUserScroll(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  useEffect(() => {
    const handleMouseScroll = () => {
      setUserScroll(true)
    }
    // detect user scroll through mouse
    // Mozilla/Webkit
    if (window.addEventListener) {
      document.addEventListener('DOMMouseScroll', handleMouseScroll, false)
    }
    //for IE/OPERA etc
    const prevOnmousewheel = document.onmousewheel
    document.onmousewheel = handleMouseScroll
    return () => {
      if (window.addEventListener) {
        document.removeEventListener('DOMMouseScroll', handleMouseScroll)
      }
      document.onmousewheel = prevOnmousewheel
    }
  })

  useEffect(() => {
    const handleClick = () => {
      setUserScroll(false)
    }
    document.querySelectorAll('a[href*="#"]').forEach(el => el.addEventListener('click', handleClick))
    return () => document.querySelectorAll('a[href*="#"]').forEach(el => el.removeEventListener('click', handleClick))
  })

  useLayoutEffect(() => {
    const handleScroll = event => {
      const scrollables = document.querySelectorAll('[data-scrollspy]')
      let targetEl = null
      scrollables.forEach(scrollable => {
        if (userScroll) {
          const elId = scrollable.getAttribute('data-scrollspy')
          const element = document.getElementById(elId)
          if (isInViewPort(element, scrollable)) {
            targetEl = element
          }
        }
      })
      if (targetEl) {
        onScroll(targetEl)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [onScroll, userScroll])
}

export default useScrollSpy
