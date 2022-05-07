import React, { useState } from 'react'
import AtlasBreadcrumbs from './AtlasBreadcrumbs'

function AtlasBreadcrumbsContainer(props) {
  const [widthsList, setWidthsList] = useState([])
  const [truncateCount, setTruncateCount] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [breadcrumbsWidth, setBreadcrumbsWidth] = useState(0)

  return (
    <>
      <AtlasBreadcrumbs
        {...props}
        widthsList={widthsList}
        truncateCount={truncateCount}
        containerWidth={containerWidth}
        breadcrumbsWidth={breadcrumbsWidth}
        setTruncateCount={setTruncateCount}
        setContainerWidth={setContainerWidth}
      />

      <AtlasBreadcrumbs {...props} setWidthsList={setWidthsList} setBreadcrumbsWidth={setBreadcrumbsWidth} hidden />
    </>
  )
}

export default AtlasBreadcrumbsContainer
