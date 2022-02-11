import React from 'react'
import { useParams } from 'react-router'

function DatasetCompare() {
  const params = useParams()
  console.log(params)

  return <div>DATASET COMPARE page</div>
}

export default DatasetCompare
