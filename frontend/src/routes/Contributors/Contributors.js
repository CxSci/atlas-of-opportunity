import React from 'react'
import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'

function Contributors() {
  return (
    <Dashboard
      headerConfig={{ content: { left: <AtlasBreadcrumbs links={[homeBreadcrumbLink, { text: 'Contributors' }]} /> } }}>
      <div>CONTRIBUTORS page</div>
    </Dashboard>
  )
}

export default Contributors
