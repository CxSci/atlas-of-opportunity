import React from 'react'
import { Box, IconButton, Breadcrumbs, Link, Button } from '@mui/material'
import { Menu as MenuIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import CompareIcon from '../Icons/CompareIcon'
import CompareIconPlus from '../Icons/CompareIconPlus'
import PATH from '../../utils/path'

function Header({ toggleSidebar, fixed, hide }) {
  return (
    <Box
      position={fixed ? 'fixed' : 'relative'}
      zIndex={theme => theme.zIndex.appBar}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'space-between'}
      height={theme => theme.components.header[fixed ? 'scrolledHeight' : 'height']}
      px={theme => theme.components.header.paddingX}
      py={theme => theme.components.header.paddingY}
      bgcolor={theme => theme.palette.background.default}
      boxShadow={theme => theme.components.header.boxShadow}
      sx={{
        transition: theme => `transform ${theme.transitions.duration.short}ms`,
        ...(fixed
          ? {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              transform: hide ? 'translateY(-102%)' : 'none'
            }
          : {})
      }}>
      <Box display={'flex'} alignItems={'center'}>
        <IconButton aria-label="delete" onClick={toggleSidebar} sx={{ mr: 2 }}>
          {fixed ? <ArrowBackIcon /> : <MenuIcon />}
        </IconButton>

        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Atlas of Opportunity
          </Link>

          <Link underline="hover" color="inherit" href={PATH.DATASET_ENTRY.replaceAll(':', '')}>
            Small Business Support
          </Link>
        </Breadcrumbs>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }}>
          <CompareIconPlus />

          <Box component={'span'} ml={1}>
            Add to comparison
          </Box>
        </Button>

        <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }}>
          <CompareIcon />

          <Box component={'span'} ml={1}>
            Compare
          </Box>
        </Button>
      </Box>
    </Box>
  )
}

export default Header
