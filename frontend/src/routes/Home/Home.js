import React from 'react'
import { Link } from '@mui/material'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'

const datasets = [
  {
    title: 'New York, NY',
    id: 'new_york',
  },
  {
    title: 'Rochester, NY',
    id: 'rochester',
  },
  {
    title: 'South Australia',
    id: 'small-business-support',
  },
]

function Home() {
  return (
    <Dashboard
      sx={{ pt: 0 }}
      headerConfig={{
        noElevateBeforeScroll: true,
        contentScrolled: {
          left: <AtlasBreadcrumbs links={[homeBreadcrumbLink]} />,
        },
      }}>
      <div className="Home">
        <br />
        <h1 align="center">Atlas of Opportunity</h1>
        <br />
        <br />
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center">
            {datasets.map(d => (
              <Grid item key={d.id} xs={6}>
                <Link to={`/explore/${d.id}`} underline="none">
                  <Paper
                    component={Stack}
                    direction="column"
                    justifyContent="center"
                    elevation={0}
                    variant="elevation"
                    style={{}}
                    align="center"
                    sx={{
                      backgroundColor: '#eee',
                      height: '280px',
                      '&:hover': {
                        backgroundColor: '#ddd',
                      },
                    }}>
                    <Typography variant="datasetTitle">{d.title}</Typography>
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </Dashboard>
  )
}

export default Home
