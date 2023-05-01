import { ThemeProvider } from '@mui/material'

import MapPopupContent from './MapPopupContent'
import initTheme from 'utils/theme'
import useCompareList from '../../hooks/useCompareList'
import useBusinessSimulator from '../../hooks/useBusinessSimulator'

export default {
  title: 'components/MapPopupContent',
  component: MapPopupContent,
  argTypes: {},
}

const Template = args => {
  const { comparisonList, addToComparison, removeFromComparison, canAddToComparison, setComparisonList } =
    useCompareList('Test')
  const {
    setBusinessLocation,
    // businessSimulatorOpen
  } = useBusinessSimulator('Test')
  const theme = initTheme('light')
  return (
    <ThemeProvider theme={theme}>
      <MapPopupContent
        comparisonList={comparisonList}
        addToComparison={addToComparison}
        removeFromComparison={removeFromComparison}
        canAddToComparison={canAddToComparison}
        setComparisonList={setComparisonList}
        setBusinessLocation={setBusinessLocation}
        businessSimulatorOpen={args.businessSimulatorOpen}
        {...args}
      />
    </ThemeProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  datasetId: 'datasetId',
  id: 'id',
  title: 'Title',
  metricName: 'Metric name',
  data: 0.75,
  colorScheme: ['#fff5eb', '#fd8d3c', '#7f2704'],
  domain: [0, 0.3, 1],
  expanded: true,
  businessSimulatorOpen: false,
  simulating: false,
}
