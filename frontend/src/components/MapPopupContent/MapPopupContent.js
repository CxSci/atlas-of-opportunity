import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import SimpleRange from '../SimpleRange'
import CompareIconPlus from '../Icons/CompareIconPlus'

function MapPopupContent({ id, title, metricName, data, colorScheme, domain, expanded }) {
  return (
    <Box
      p={1.5}
      bgcolor={expanded ? '#fff' : 'rgba(255, 255, 255, 0.9)'}
      color={theme => theme.palette.darkGrey.main}
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
        <Box>
          <SimpleRange
            value={data}
            size={'small'}
            variant={'gradient'}
            colorScheme={colorScheme}
            domain={domain}
          />
        </Box>
      )}

      {expanded && (
        <Button
          variant={'text'}
          sx={{
            p: 0,
            color: theme => theme.palette.darkGrey.main,
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

MapPopupContent.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  metricName: PropTypes.string,
  data: PropTypes.number,
  colorScheme: PropTypes.array,
  domain: PropTypes.array,
  expanded: PropTypes.bool,
}

MapPopupContent.defaultProps = {
  domain: [0, 1],
}

export default MapPopupContent
