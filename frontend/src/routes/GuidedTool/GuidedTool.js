import React from 'react'
import { useParams } from 'react-router'

function GuidedTool() {
  const params = useParams()
  console.log(params)

  return <div>GUIDED TOOL page</div>
}

export default GuidedTool
