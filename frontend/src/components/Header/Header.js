import React from 'react'
import { Box, IconButton, Breadcrumbs, Link, Button, FormControl, Input, InputAdornment } from '@mui/material'
import { Menu as MenuIcon, ArrowBack as ArrowBackIcon, Search as SearchIcon } from '@mui/icons-material'

import CompareIcon from '../Icons/CompareIcon'
import CompareIconPlus from '../Icons/CompareIconPlus'
import PATH from '../../utils/path'

function Header({
  toggleSidebar,
  scrolled,
  isExplorePage,
  isDetailPage,
  isComparePage,
  showSearch,
  datasetId,
  datasetName,
  searchPlaceholder = 'Search',
  showBackBtn,
  goBack,
}) {
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
        {showBackBtn ? (
          <IconButton aria-label="back" onClick={goBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="menu" onClick={() => toggleSidebar(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href={PATH.HOME}>
            Atlas of Opportunity
          </Link>

          {isExplorePage && (
            <Link
              underline="hover"
              color="inherit"
              href={isDetailPage ? PATH.DATASET.replace(':datasetId', datasetId) : undefined}>
              {datasetName}
            </Link>
          )}

          {isComparePage && (
            <Link underline="hover" color="inherit">
              Compare
            </Link>
          )}
        </Breadcrumbs>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        {/* search */}
        {showSearch && (
          <FormControl variant="filled">
            <Input
              id="input-header-search"
              placeholder={searchPlaceholder}
              // TODO: if border has to be removed
              // sx={{ ':before': { content: 'none' }, ':after': { content: 'none' } }}
              sx={{ width: theme => theme.components.searchInput.width }}
              startAdornment={
                <InputAdornment position="start" sx={{ mt: '0 !important' }}>
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        )}

        {/* add to comparison */}
        {isDetailPage && !isComparePage && (
          <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }}>
            <CompareIconPlus />

            <Box component={'span'} ml={1}>
              Add to comparison
            </Box>
          </Button>
        )}

        {/* compare */}
        {isExplorePage && !isComparePage && (
          <Button variant="contained" color={'primary'} sx={{ color: '#fff', ml: 2 }}>
            <CompareIcon />

            <Box component={'span'} ml={1}>
              Compare
            </Box>
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Header
