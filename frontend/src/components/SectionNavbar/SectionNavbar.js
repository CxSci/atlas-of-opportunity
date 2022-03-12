import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { slugify } from 'utils/helpers'
import useScrollSpy from 'utils/scrollSpy'

export const SectionNavs = ({ sections }) => {
  const location = useLocation()
  const [locationHash, setLocationHash] = useState(location.hash)

  const handleScroll = useCallback(element => {
    const hash = `#${element.id}`
    window.history.pushState(null, null, hash)
    setLocationHash(hash)
  }, [])

  const handleNav = useCallback(event => {
    event.preventDefault()
    const hash = event.target.href.split('#')[1]
    const elem = document.getElementById(hash)
    elem.scrollIntoView({ behavior: 'smooth' })
    setLocationHash(`#${hash}`)
  }, [])

  useScrollSpy({ onScroll: handleScroll })

  return (
    <Box sx={{ position: 'fixed', width: '100%', zIndex: 'appBar' }}>
      <Box
        sx={{
          display: 'flex',
          bgcolor: 'background.default',
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

export default SectionNavs
