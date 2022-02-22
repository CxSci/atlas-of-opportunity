import React from 'react'
import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'

function Research() {
  return (
    <Dashboard
      headerConfig={{ content: { left: <AtlasBreadcrumbs links={[homeBreadcrumbLink, { text: 'Research' }]} /> } }}>
      <div>RESEARCH page</div>
    </Dashboard>
  )
}

export default Research
