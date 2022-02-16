import React from 'react'
import { Box, Divider, Drawer, IconButton, List } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import CloseIcon from '@mui/icons-material/Close'

function Sidebar({ open, handleClose }) {
  return (
    <Drawer
      sx={{
        width: theme => theme.components.sidebar.width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: theme => theme.components.sidebar.width
        }
      }}
      variant="persistent"
      anchor="left"
      open={open}>
      <Box
        height={theme => theme.components.header.height}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        fontWeight={700}
        fontSize={20}
        px={2}
        py={1}>
        <span>Atlas of Opportunity</span>

        <IconButton aria-label="delete" onClick={handleClose} sx={{ ml: 3 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {['Home', 'Explore Regions', 'Explore Occupations', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem button>
          <ListItemText
            primary={
              <>
                Small Business <br /> Recommendation Tool
              </>
            }
          />
        </ListItem>
      </List>

      <Divider />

      <List>
        {['Methods', 'Research', 'Frequently Asked Questions', 'About the Atlas'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar
