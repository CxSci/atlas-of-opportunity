import React from 'react'
import { Box } from '@mui/material'

function AppContainer({ children }) {
  return (
    <Box
      sx={
        {
          // paddingTop: theme => theme.components.header.height
        }
      }>
      {children}
    </Box>
  )
}

export default AppContainer
