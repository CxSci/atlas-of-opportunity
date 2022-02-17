import React from 'react'
import { useParams } from 'react-router'
import Dashboard from '../../components/Dashboard'

function Dataset() {
  const params = useParams()
  console.log(params)

  return (
    <Dashboard>
      <div>DATASET page</div>{' '}
    </Dashboard>
  )
}

export default Dataset
