import React from 'react'
import { Box, IconButton } from '@mui/material'
import { Menu as MenuIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'

function Header({ toggleSidebar, scrolled, backRoute, navigate, contentScrolled, content }) {
  return (
    <Box
      position={'fixed'}
      top={0}
      bottom={0}
      left={0}
      right={0}
      zIndex={theme => theme.zIndex.appBar}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'space-between'}
      height={theme => theme.components.header[scrolled ? 'scrolledHeight' : 'height']}
      px={theme => theme.components.header.paddingX}
      py={theme => theme.components.header.paddingY}
      bgcolor={theme => theme.components.header.bgColor}
      boxShadow={theme => theme.components.header.boxShadow}
      sx={{
        transition: theme => `height ${theme.transitions.duration.short}ms`,
      }}>
      <Box display={'flex'} alignItems={'center'}>
        {backRoute ? (
          <IconButton aria-label="back" onClick={() => navigate(backRoute)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="menu" onClick={() => toggleSidebar(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        {scrolled && contentScrolled?.left ? contentScrolled.left : content?.left}
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        {scrolled && contentScrolled?.right ? contentScrolled.right : content?.right}
      </Box>
    </Box>
  )
}

export default Header
