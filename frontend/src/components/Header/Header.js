import React from 'react'
import { Box, IconButton } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

function Header({ toggleSidebar }) {
  return (
    <Box
      sx={{
        height: theme => theme.components.header.height,
        paddingX: theme => theme.components.header.paddingX,
        paddingY: theme => theme.components.header.paddingY,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme => theme.palette.background
      }}>
      <IconButton aria-label="delete" onClick={toggleSidebar}>
        <MenuIcon />
      </IconButton>
    </Box>
  )
}

export default Header
