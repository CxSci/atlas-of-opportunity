import React from 'react'
import { useParams } from 'react-router'
import Dashboard from '../../components/Dashboard'

function DatasetCompare() {
  const params = useParams()
  console.log(params)

  return (
    <Dashboard>
      <div>DATASET COMPARE page</div>
    </Dashboard>
  )
}

export default DatasetCompare
