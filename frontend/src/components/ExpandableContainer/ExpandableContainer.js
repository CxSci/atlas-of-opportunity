import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { EXPANDABLE_MINIMUM_ITEMS } from 'utils/constants'
import MetricFilters from 'components/MetricFilters'
import { filterDataByFilterValues, getDefaultFilterValues } from './ExpandableContainer.utils'

const ExpandableContainer = ({ data, filters, children }) => {
  const [expanded, setExpanded] = useState(false)
  const [filterValues, setFilterValues] = useState(getDefaultFilterValues(filters))

  const filteredData = useMemo(() => filterDataByFilterValues(data, filterValues), [data, filterValues])

  const expandable = filteredData.length > EXPANDABLE_MINIMUM_ITEMS

  const truncatedData = useMemo(
    () => (expanded || !expandable ? filteredData : filteredData.slice(0, EXPANDABLE_MINIMUM_ITEMS)),
    [filteredData, expanded, expandable],
  )

  const handleToggle = useCallback(
    event => {
      event.preventDefault()
      setExpanded(prevExpanded => !prevExpanded)
    },
    [setExpanded],
  )

  useEffect(() => {
    if (filters) {
      setFilterValues(getDefaultFilterValues(filters))
    }
  }, [filters, setFilterValues])

  return (
    <Box>
      {filters && (
        <MetricFilters filters={filters} data={data} filterValues={filterValues} onChange={setFilterValues} />
      )}
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
