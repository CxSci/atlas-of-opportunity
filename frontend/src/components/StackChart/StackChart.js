import { useCallback, useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useTheme } from '@mui/system'
import { VictoryAxis, VictoryChart, VictoryArea, VictoryStack, VictoryTooltip, VictoryVoronoiContainer } from 'victory'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'

import { ChartAxisType } from 'utils/propTypes'
import { getStackData, STACK_COLORS } from './StackChart.utils'
import { useVictoryTheme, useClientSize } from 'hooks/victory'
import { formatTickNumber, angledProperty } from 'utils/victory'
import ChartFlyOut from 'components/ChartFlyOut'

const StackChart = ({ data, xAxis, yAxis }) => {
  const intl = useIntl()
  const theme = useTheme()
  const victoryTheme = useVictoryTheme(theme)

  const ref = useRef()
  const size = useClientSize(ref)
  const stackData = useMemo(() => getStackData(data), [data])

  const handleXTickFormat = useCallback(
    t => {
      return formatTickNumber(t, xAxis, intl)
    },
    [intl, xAxis],
  )

  const handleYTickFormat = useCallback(
    t => {
      return formatTickNumber(t, yAxis, intl)
    },
    [intl, yAxis],
  )

  return (
    <Box ref={ref}>
      <VictoryChart
        {...size}
        theme={victoryTheme}
        domainPadding={{
          x: [0, 15],
          y: [0, 20],
        }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={() => ' '}
            labelComponent={
              <VictoryTooltip
                constrainToVisibleArea
                flyoutComponent={<ChartFlyOut placement="bottom" xAxisLabel={xAxis.title} yAxisLabel={yAxis.title} />}
              />
            }
          />
        }>
        <VictoryAxis tickFormat={handleXTickFormat} style={xAxis.angled && angledProperty} />
        <VictoryAxis dependentAxis tickFormat={handleYTickFormat} />
        <VictoryStack colorScale={STACK_COLORS}>
          {stackData.map(item => (
            <VictoryArea key={item.title} data={item.data} />
          ))}
        </VictoryStack>
      </VictoryChart>
    </Box>
  )
}

StackChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      y: PropTypes.number.isRequired,
      z: PropTypes.string,
    }),
  ),
  xAxis: ChartAxisType.isRequired,
  yAxis: ChartAxisType.isRequired,
}

export default StackChart
