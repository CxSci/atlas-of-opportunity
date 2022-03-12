import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { slugify } from 'utils/helpers'
import useScrollSpy from 'utils/scrollSpy'

export const SectionNavbar = ({ sections, hashChangeOnScroll }) => {
  const location = useLocation()
  const [locationHash, setLocationHash] = useState(location.hash)

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
    const id = event.target.href.split('#')[1]
    const hash = `#${id}`
    const elem = document.getElementById(id)
    elem.scrollIntoView({ behavior: 'smooth' })
    window.history.pushState(null, null, hash)
    setLocationHash(hash)
  }, [])

  useScrollSpy({ onScroll: handleScroll })

  return (
    <Box sx={{ position: 'sticky', top: 80, width: '100%', zIndex: 'appBar' }}>
      <Box
        sx={{
          display: 'flex',
          bgcolor: 'background.default',
          whiteSpace: 'nowrap',
        }}>
        {sections.map((section, index) => {
          const sectionHash = `#${slugify(section.title)}`
          const active = locationHash === sectionHash
          return (
            <Link
              href={sectionHash}
              key={index}
              underline="hover"
              onClick={handleNav}
              sx={{
                display: 'block',
                px: 0,
                py: 1,
                mx: 2,
                minWidth: 0,
                maxWidth: 'auto',
                fontWeight: active ? 700 : 400,
                color: 'text.primary',
              }}>
              {section.title}
            </Link>
          )
        })}
      </Box>
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
