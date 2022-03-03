import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import SimpleRange from '../SimpleRange'
import CompareIconPlus from '../Icons/CompareIconPlus'

function MapPopupContent({ id, title, metricName, data, colorScheme, addToComparison }) {
  return (
    <Box
      p={1.5}
      bgcolor={'#fff'}
      color={'#333'}
      borderRadius={'10px'}
      width={200}
      boxShadow={'0px 2px 4px rgba(0, 0, 0, 0.25)'}>
      <Typography fontSize={18} fontWeight={500} color={'#000'} mb={'8px'}>
        {title}
      </Typography>
      <Typography fontSize={14} mb={0.5}>
        {metricName}
      </Typography>

      {data > 0 && (
        <Box bgcolor={'#F2F2F2'}>
          <SimpleRange
            value={data}
            min={0}
            max={1}
            height={14}
            style={'gradient'}
            colorScheme={colorScheme || []}
            sx={{ backgroundColor: '#F2F2F2' }}
          />
        </Box>
      )}

      {addToComparison && (
        <Button
          variant={'text'}
          disableRipple
          sx={{
            p: 0,
            color: '#333',
            mt: 1,
            textTransform: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
          onClick={() => console.log(id)}>
          <CompareIconPlus size={22} />

          <Typography component={'span'} fontWeight={500} fontSize={14} sx={{ ml: 1 }}>
            Add to comparison
          </Typography>
        </Button>
      )}
    </Box>
  )
}

export default MapPopupContent
