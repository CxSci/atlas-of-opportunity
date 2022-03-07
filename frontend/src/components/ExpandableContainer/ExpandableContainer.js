import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'

import { EXPANDABLE_MINIMUM_ITEMS } from 'utils/constants'

const ExpandableContainer = ({ data, children }) => {
  const [expanded, setExpanded] = useState(false)
  const expandable = data.length > EXPANDABLE_MINIMUM_ITEMS

  const truncatedData = useMemo(
    () => (expanded || !expandable ? data : data.slice(0, EXPANDABLE_MINIMUM_ITEMS)),
    [data, expanded, expandable],
  )

  const handleToggle = useCallback(
    event => {
      event.preventDefault()
      setExpanded(prevExpanded => !prevExpanded)
    },
    [setExpanded],
  )

  return (
    <Box>
      {children(truncatedData)}
      {expandable && (
        <Link underline="hover" href="#" onClick={handleToggle}>
          {expanded ? 'Show Less' : 'Show More'}
        </Link>
      )}
    </Box>
  )
}

ExpandableContainer.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
}

export default ExpandableContainer
