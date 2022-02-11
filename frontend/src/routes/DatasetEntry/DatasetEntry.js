import React from 'react'
import { useParams } from 'react-router'

function DatasetEntry() {
  const params = useParams()
  console.log(params)

  return <div>DATASET ENTRY page</div>
}

export default DatasetEntry
