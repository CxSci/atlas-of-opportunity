import React from 'react'
import { Breadcrumbs, Link } from '@mui/material'
import PATH from '../../utils/path'
import PropTypes from 'prop-types'

export const homeBreadcrumbLink = {
  path: PATH.HOME,
  text: 'Atlas of Opportunity',
}

function AtlasBreadcrumbs({ links = [] }) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {(links || []).map(linkItem => (
        <Link key={linkItem?.text} underline="hover" color="inherit" href={linkItem?.path}>
          {linkItem?.text}
        </Link>
      ))}
    </Breadcrumbs>
  )
}

AtlasBreadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.any,
      text: PropTypes.any,
    }),
  ),
}

export default AtlasBreadcrumbs
