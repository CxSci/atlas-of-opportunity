import { useCallback, useState } from 'react'
import useLocalStorage from './useLocalStorage'
import { MAX_COMPARE_COUNT } from '../utils/constants'

export default function useCompareList(datasetId) {
  const [compareListOpen, setCompareListOpen] = useState(false)
  const [comparisonList, setComparisonList] = useLocalStorage(`compare-${datasetId}`, [])
  const [geoJsonMap, setGeoJsonMap] = useState({})

  const removeFromComparison = useCallback(
    id => {
      setComparisonList(comparisonList => {
        const index = comparisonList.findIndex(item => item?.id === id)
        comparisonList.splice(index, 1)

        setGeoJsonMap(geoJsonMap => {
          delete geoJsonMap[id]

          return { ...geoJsonMap }
        })

        return [...comparisonList]
      })
    },
    [setComparisonList],
  )

  const addToComparison = useCallback(
    item => {
      setComparisonList(comparisonList => {
        return [...comparisonList, item]
      })
      setCompareListOpen(true)
    },
    [setComparisonList],
  )

  const canAddToComparison = useCallback(
    entryId =>
      comparisonList?.length < MAX_COMPARE_COUNT && comparisonList.findIndex(item => item?.id === entryId) === -1,
    [comparisonList],
  )

  return {
    comparisonList,
    setComparisonList,
    removeFromComparison,
    addToComparison,
    canAddToComparison,
    setGeoJsonMap,
    geoJsonMap,
    compareListOpen,
    setCompareListOpen,
  }
}
