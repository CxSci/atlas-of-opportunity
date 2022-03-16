import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import HeaderContext from 'contexts/HeaderContext'
import PropTypes from 'prop-types'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material'

import { slugify } from 'utils/helpers'
import SimpleCarousel from 'components/SimpleCarousel'
import { scrollIntoView } from 'utils/animateScroll'
import useScrollSpy from 'utils/scrollSpy'

export const SectionNavbar = ({ sections, hashChangeOnScroll }) => {
  const location = useLocation()
  const cancelScrollRef = useRef(null)
  const [locationHash, setLocationHash] = useState(location.hash)
  const [isSticky, setIsSticky] = useState(false)
  const headerContext = useContext(HeaderContext)
  const theme = useTheme()
  const ref = useRef()
  const navbarTop = parseFloat(headerContext.customScrolledHeight || theme.components.header.scrolledHeight)

  const handleScroll = useCallback(
    element => {
      const hash = `#${element.id}`
      if (hashChangeOnScroll) {
        window.history.pushState(null, null, hash)
      }
      setLocationHash(hash)
    },
    [hashChangeOnScroll],
  )

  const handleNav = useCallback(event => {
    event.preventDefault()
    const id = event.currentTarget.href.split('#')[1]
    const hash = `#${id}`
    const elem = document.getElementById(id)
    if (elem) {
      cancelScrollRef.current?.cancel()
      cancelScrollRef.current = scrollIntoView(elem)
    }
    window.history.pushState(null, null, hash)
    setLocationHash(hash)
  }, [])

  useScrollSpy({ onScroll: handleScroll })

  useEffect(() => {
    const cachedRef = ref.current
    const observer = new IntersectionObserver(
      ([e]) => {
        setIsSticky(e.intersectionRatio < 1)
      },
      {
        threshold: [1],
        rootMargin: `-${navbarTop + 1}px 100% 0px 100%`,
      },
    )
    observer.observe(cachedRef)

    return () => observer.unobserve(cachedRef)
  }, [navbarTop])

  return (
    <Box
      ref={ref}
      sx={{
        height: `${theme.components.SectionNavbar.height}px`,
        position: 'sticky',
        top: navbarTop,
        zIndex: 'appBar',
        bgcolor: theme.components.SectionNavbar.bgColor,
        borderTop: isSticky ? 1 : 0,
        borderTopColor: theme.components.SectionNavbar.borderColor,
        boxShadow: isSticky ? theme.components.header.boxShadow : undefined,
      }}>
      <Container>
        <SimpleCarousel value={locationHash}>
          {sections.map((section, index) => {
            const sectionHash = `#${slugify(section.title)}`
            const active = locationHash === sectionHash || (!locationHash && index === 0)
            return (
              <SimpleCarousel.Item
                key={index}
                value={sectionHash}
                sx={{
                  mx: 1,
                  '&:first-of-type': {
                    ml: 0,
                  },
                  '&:last-of-type': {
                    mr: 0,
                  },
                }}>
                <Link
                  href={sectionHash}
                  underline="hover"
                  onClick={handleNav}
                  sx={{
                    display: 'block',
                    px: 0,
                    my: 1,
                    minWidth: 0,
                    maxWidth: 'auto',
                    color: 'text.primary',
                    position: 'relative',
                  }}>
                  <Box component="span" sx={{ visibility: 'hidden', fontWeight: 700 }} role="none">
                    {section.title}
                  </Box>
                  <Box component="span" sx={{ position: 'absolute', left: 0, top: 0, fontWeight: active ? 700 : 400 }}>
                    {section.title}
                  </Box>
                </Link>
              </SimpleCarousel.Item>
            )
          })}
        </SimpleCarousel>
      </Container>
    </Box>
  )
}

SectionNavbar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
  ),
  hashChangeOnScroll: PropTypes.bool,
}

export default SectionNavbar
