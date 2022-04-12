import React, { Fragment } from 'react'
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'

// TODO: replace with real <Map mini={true} />
const MiniMap = () => (
  <Box
    width={64}
    minWidth={64}
    height={64}
    border={'1px solid #ccc'}
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}>
    Map
  </Box>
)

function ComparisonMenu({ comparisonList, removeFromComparison }) {
  return (
    <Box
      component={Stack}
      position={'absolute'}
      right={theme => theme.components.header.paddingX}
      top={'calc(100% + 4px)'}
      width={theme => theme.components.comparisonMenu.width}
      bgcolor={theme => theme.components.comparisonMenu.bgColor}
      boxShadow={theme => theme.components.comparisonMenu.boxShadow}
      borderRadius={theme => theme.components.comparisonMenu.borderRadius}>
      <Typography fontSize={14} align={'center'} px={3} py={2.25}>
        Add up to 4 regions to compare them side-by-side.
      </Typography>

      {comparisonList.map(item => (
        <Fragment key={item?.id}>
          <Divider />

          <Box display={'flex'} alignItems={'center'} p={1}>
            <MiniMap />

            <Typography component={'span'} ml={2}>
              {item?.title}
            </Typography>

            <IconButton
              onClick={() => removeFromComparison(item?.id)}
              sx={{
                ml: 'auto',
              }}>
              <Delete sx={{ color: '#666' }} />
            </IconButton>
          </Box>
        </Fragment>
      ))}

      <Divider />

      <Box px={3} py={2}>
        <Button
          variant={'contained'}
          color={'primary'}
          sx={{ height: '42px', color: '#fff', borderRadius: '24px', display: 'block', width: '100%', fontWeight: 700 }}
          disabled={!comparisonList?.length}>
          View Comparison
        </Button>
      </Box>
    </Box>
  )
}

export default ComparisonMenu
