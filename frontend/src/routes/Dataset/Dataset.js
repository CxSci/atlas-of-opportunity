import React from 'react'
import { useParams } from 'react-router'

function Dataset() {
  const params = useParams()
  console.log(params)

  return <div>DATASET page</div>
}

export default Dataset
