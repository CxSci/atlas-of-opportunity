import { useContext } from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'

import HeaderContext from 'contexts/HeaderContext'

const Anchor = ({ htmlId }) => {
  const theme = useTheme()
  const headerContext = useContext(HeaderContext)
  const navbarTop = parseFloat(headerContext.customScrolledHeight || theme.components?.header?.scrolledHeight || 0)
  const top = navbarTop + (theme.components?.SectionNavbar?.height || 0) + parseFloat(theme.spacing(2))

  return (
    <Box
      id={htmlId}
      sx={{
        position: 'relative',
        visibility: 'hidden',
        top: -top,
      }}
    />
  )
}

export default Anchor
