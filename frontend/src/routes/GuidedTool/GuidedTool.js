import React from 'react'
import { useParams } from 'react-router'
import Dashboard from '../../components/Dashboard'

function GuidedTool() {
  const params = useParams()
  console.log(params)

  return (
    <Dashboard>
      <div>GUIDED TOOL page</div>
    </Dashboard>
  )
}

export default GuidedTool
