import React from 'react'
import { useParams } from 'react-router'
import Dashboard from '../../components/Dashboard'

function DatasetEntry() {
  const params = useParams()
  console.log(params)

  return (
    <Dashboard>
      <div>DATASET ENTRY page</div>
    </Dashboard>
  )
}

export default DatasetEntry
