import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'

import { businessTypeOptions } from './constants'
import StaticMap from '../StaticMap'
import { getDatasetGeoJSON } from 'store/modules/dataset'
import { getBusinessSimulation } from 'store/modules/assistants'
import { useDispatch } from 'react-redux'
import { setApiData } from '../../store/modules/api'

const LocationListItem = ({ dispatch, businessLocation, setBusinessLocation, disabled, ...props }) => {
  const [geoJson, setGeoJson] = useState()

  useEffect(() => {
    const datasetId = businessLocation?.datasetId
    const id = businessLocation?.id
    dispatch(
      getDatasetGeoJSON({
        datasetId,
        params: {
          ids: id,
          include_neighbors: true,
          format: 'json',
        },
        success: geoJson => {
          if (!geoJson) {
            return
          }
          setGeoJson(geoJson)
        },
      }),
    )
  }, [businessLocation, dispatch])

  return (
    <ListItem disableGutters disabled={disabled}>
      <Box sx={{ width: 64, minWidth: 64 }}>
        {geoJson ? (
          <StaticMap square areaId={businessLocation?.id} geoJSON={geoJson} />
        ) : (
          <Skeleton variant="rectangular" width={64} height={64} />
        )}
      </Box>

      <Typography component={'span'} ml={2}>
        {businessLocation?.title}
      </Typography>

      <IconButton
        disabled={disabled}
        onClick={() => {
          setBusinessLocation(null)
        }}
        sx={{
          ml: 'auto',
        }}>
        <DeleteIcon sx={{ color: '#666' }} />
      </IconButton>
    </ListItem>
  )
}

const FormSection = ({ title, children, ...props }) => {
  return (
    <Box pt={1}>
      <Box py={1}>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
          }}>
          {title}
        </Typography>
      </Box>
      <Box px={1}>{children}</Box>
    </Box>
  )
}

const BusinessSimulatorDialog = ({ assistantProps, ...props }) => {
  const {
    businessLocation,
    setBusinessLocation,
    businessCount,
    setBusinessCount,
    businessType,
    setBusinessType,
    closeBusinessSimulator,
    simulating,
    setSimulating,
  } = assistantProps

  const [canSimulate, setCanSimulate] = useState(false)

  const dispatch = useDispatch()

  const onCountChange = e => {
    setBusinessCount(e.target.value)
  }

  const onTypeChange = e => {
    setBusinessType(e.target.value)
  }

  useEffect(() => {
    setCanSimulate(businessLocation && businessCount > 0 && businessType)
  }, [businessLocation, businessCount, businessType])

  const toggleSimulating = () => {
    if (canSimulate) {
      if (!simulating) {
        startSimulating()
      } else {
        stopSimulating()
      }
    }
  }

  const startSimulating = () => {
    if (simulating) {
      return
    }
    setSimulating(true)
    // Clear any stale data
    // dispatch(setApiData({ data: [], selectorKey: 'businessSimulation' }))

    const datasetId = businessLocation?.datasetId
    const id = businessLocation?.id
    dispatch(
      getBusinessSimulation({
        datasetId,
        params: {
          cbg_geoid: id,
          score_type: businessType,
          poi_type: businessType,
          num_new_pois: businessCount,
          format: 'json',
        },
        success: response => {
          if (!response) {
            return
          }
        },
      }),
    )
  }

  const stopSimulating = () => {
    setSimulating(false)
    // Clear simulation to prevent stale data
    dispatch(setApiData({ data: [], selectorKey: 'businessSimulation' }))
  }

  return (
    <Box
      sx={{
        width: 320,
      }}
      {...props}>
      <Paper elevation={3}>
        <List dense={true}>
          <ListItem>
            <ListItemIcon sx={{ minWidth: theme => theme.spacing(4) }}>
              <AddBusinessOutlinedIcon htmlColor="#333333" />
            </ListItemIcon>
            <ListItemText
              primary="Simulate New Businesses"
              primaryTypographyProps={{
                fontSize: '1rem',
                fontWeight: '700',
              }}
            />
            <ListItemIcon sx={{ minWidth: theme => theme.spacing(2) }}>
              {/*
                CloseIcon should be clickable and should cancel any
                simulation and bring back AssistantMenu
              */}
              <IconButton size="small" onClick={closeBusinessSimulator}>
                <CloseIcon htmlColor="#333333" />
              </IconButton>
            </ListItemIcon>
          </ListItem>
        </List>
        <Divider />
        <Stack direction="column" justifyContent="flex-start" alignItems="stretch" spacing={0} px={2}>
          <FormSection title="Business Location">
            {/*<Typography>same row as comparison menu</Typography>*/}
            {businessLocation ? (
              <LocationListItem
                dispatch={dispatch}
                businessLocation={businessLocation}
                setBusinessLocation={setBusinessLocation}
                disabled={simulating}
                {...props}
              />
            ) : (
              <Typography>No location selected</Typography>
            )}
          </FormSection>
          <FormSection title="Business Details">
            {/*<Typography>fixed width text field and dropdown of business types (hardcoded for now)</Typography>*/}
            <TextField
              variant="outlined"
              label="Count"
              size="small"
              margin="normal"
              fullWidth
              disabled={simulating}
              onChange={onCountChange}
              value={businessCount}
            />
            <TextField
              select
              variant="outlined"
              label="Type"
              defaultValue=""
              size="small"
              margin="normal"
              fullWidth
              disabled={simulating}
              onChange={onTypeChange}
              value={businessType}>
              <MenuItem key="" value="">
                Select
              </MenuItem>
              {businessTypeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormSection>
          {/*<Typography>start simulation / stop simulation / disabled start simulation</Typography>*/}
          <Box
            px={1}
            py={2}
            sx={{
              textAlign: 'center',
            }}>
            <Button
              variant="contained"
              color={simulating ? 'error' : 'primary'}
              disabled={!canSimulate}
              sx={{ color: '#fff' }}
              onClick={() => toggleSimulating()}
              {...props}>
              <Typography component={'span'} fontWeight={700}>
                {simulating ? 'Stop' : 'Start'} Simulation
              </Typography>
            </Button>
          </Box>
          {/*<Typography>centered subtitle (static text pre-simulation, format string during simulation)</Typography>*/}
          <Box px={1} pt={0.5} pb={2.5}>
            <Typography
              sx={{
                textAlign: 'center',
              }}>
              Simulate how new businesses affect access to services.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default BusinessSimulatorDialog
