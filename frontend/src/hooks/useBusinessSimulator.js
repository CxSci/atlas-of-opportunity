import { useCallback, useState } from 'react'
import useLocalStorage from './useLocalStorage'
import { businessTypeOptions } from '../components/BusinessSimulatorDialog/constants'

export default function useBusinessSimulator(datasetId) {
  const [businessSimulatorOpen, setBusinessSimulatorOpen] = useState(false)
  const [businessLocation, setBusinessLocation] = useLocalStorage(`businessLocation-${datasetId}`, [])
  const [businessCount, setBusinessCount] = useLocalStorage(`businessCount-${datasetId}`, [])
  const [businessType, setBusinessType] = useLocalStorage(`businessType-${datasetId}`, [])
  const [simulating, setSimulating] = useState(false)

  const businessTypeTitle = useCallback(() => {
    const title = businessTypeOptions.find(a => a.value === businessType)?.label
    return 'Access to Services - ' + (title ?? 'General')
  }, [businessType])

  const openBusinessSimulator = useCallback(() => {
    setBusinessLocation(null)
    setBusinessSimulatorOpen(true)
  }, [setBusinessLocation, setBusinessSimulatorOpen])

  const closeBusinessSimulator = useCallback(() => {
    setBusinessSimulatorOpen(false)
  }, [setBusinessSimulatorOpen])

  return {
    businessLocation,
    setBusinessLocation,
    businessCount,
    setBusinessCount,
    businessType,
    setBusinessType,
    businessTypeTitle,
    businessSimulatorOpen,
    openBusinessSimulator,
    closeBusinessSimulator,
    simulating,
    setSimulating,
  }
}
