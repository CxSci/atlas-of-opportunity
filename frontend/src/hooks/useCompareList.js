import useLocalStorage from './useLocalStorage'

export default function useCompareList(datasetId) {
  const [comparisonList, setComparisonList] = useLocalStorage(`compare-${datasetId}`, [])

  const removeFromComparison = id => {
    setComparisonList(comparisonList => {
      const index = comparisonList.findIndex(item => item?.id === id)
      comparisonList.splice(index, 1)

      return [...comparisonList]
    })
  }

  const addToComparison = item => {
    setComparisonList(comparisonList => {
      return [...comparisonList, item]
    })
  }

  return { comparisonList, setComparisonList, removeFromComparison, addToComparison }
}
