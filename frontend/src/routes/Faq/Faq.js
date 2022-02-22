import React from 'react'
import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'

function Faq() {
  return (
    <Dashboard headerConfig={{ content: { left: <AtlasBreadcrumbs links={[homeBreadcrumbLink, { text: 'Faq' }]} /> } }}>
      <div>FAQ page</div>
    </Dashboard>
  )
}

export default Faq
