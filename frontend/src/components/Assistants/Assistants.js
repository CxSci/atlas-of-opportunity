import React from 'react'

import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material'
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined'
import BusinessSimulatorDialog from '../BusinessSimulatorDialog'

const AssistantMenu = ({ assistantProps, ...props }) => {
  const { openBusinessSimulator } = assistantProps
  return (
    <Box
      {...props}
      sx={{
        width: 240,
      }}>
      <Paper elevation={3}>
        <List dense={true}>
          <ListItem>
            <ListItemText
              primary="Assistants"
              primaryTypographyProps={{
                fontSize: '1rem',
                fontWeight: '700',
              }}
            />
          </ListItem>
        </List>
        <Divider />
        <List dense={true}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => openBusinessSimulator(true)}>
              <ListItemIcon sx={{ minWidth: theme => theme.spacing(4) }}>
                <AddBusinessOutlinedIcon htmlColor="#333333" />
              </ListItemIcon>
              <ListItemText
                primary="Simulate New Businesses"
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: '500',
                  fontStyle: 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}

const Assistants = ({ assistantProps, ...props }) => {
  const { businessSimulatorOpen } = assistantProps
  if (businessSimulatorOpen) {
    return <BusinessSimulatorDialog assistantProps={assistantProps} {...props} />
  }
  return <AssistantMenu assistantProps={assistantProps} {...props} />
}

export default Assistants
