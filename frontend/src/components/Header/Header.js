import React from 'react'
import { Box, IconButton, styled } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Menu as MenuIcon } from '@mui/icons-material'

const NavigateButton = styled(IconButton)({
  '&:hover': {
    backgroundColor: 'transparent',
  },
})

function Header({
  toggleSidebar,
  scrolled,
  backRoute,
  navigate,
  content,
  contentScrolled,
  shadowOnScroll,
  leftContainerProps,
  customScrolledHeight,
}) {
  return (
    <Box
      position={'fixed'}
      top={0}
      left={0}
      right={0}
      zIndex={theme => theme.zIndex.appBar}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'space-between'}
      height={theme => (contentScrolled && scrolled && customScrolledHeight) || theme.components.header['height']}
      px={theme => theme.components.header.paddingX}
      py={theme => theme.components.header.paddingY}
      bgcolor={theme => theme.components.header.bgColor}
      boxShadow={theme => (!shadowOnScroll || scrolled) && theme.components.header.boxShadow}
      sx={{
        transition: theme =>
          `height ${theme.transitions.duration.short}ms, box-shadow ${theme.transitions.duration.short}ms`,
      }}>
      <Box display={'flex'} alignItems={'center'} {...leftContainerProps}>
        <Box component="span" sx={{ mr: 2 }}>
          {backRoute ? (
            <NavigateButton aria-label="back" onClick={() => navigate(backRoute)}>
              <ArrowBackIcon fontSize="large" sx={{ color: theme => theme.components.header.iconColor }} />
            </NavigateButton>
          ) : (
            <NavigateButton aria-label="menu" onClick={() => toggleSidebar(true)}>
              <MenuIcon fontSize="large" sx={{ color: theme => theme.components.header.iconColor }} />
            </NavigateButton>
          )}
        </Box>

        {scrolled && contentScrolled?.left ? contentScrolled.left : content?.left}
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        {scrolled && contentScrolled?.right ? contentScrolled.right : content?.right}
      </Box>
    </Box>
  )
}

export default Header
