import { useCallback, useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useTheme } from '@mui/system'
import { VictoryAxis, VictoryChart, VictoryArea, VictoryStack, VictoryTooltip, VictoryVoronoiContainer } from 'victory'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'

import { ChartAxisType } from 'utils/propTypes'
import { getStackData, STACK_COLORS } from './StackChart.utils'
import { useVictoryTheme, useClientSize } from 'hooks/victory'
import { formatTickNumber } from 'utils/victory'
import ChartFlyOut from 'components/ChartFlyOut'

const StackChart = ({ data, xAxis, yAxis }) => {
  const theme = useTheme()
  const victoryTheme = useVictoryTheme(theme)
  const { formatNumber } = useIntl()

  const ref = useRef()
  const size = useClientSize(ref)
  const stackData = useMemo(() => getStackData(data), [data])

  const handleXTickFormat = useCallback(
    t => {
      return formatTickNumber(t, formatNumber, xAxis)
    },
    [formatNumber, xAxis],
  )

  const handleYTickFormat = useCallback(
    t => {
      return formatTickNumber(t, formatNumber, yAxis)
    },
    [formatNumber, yAxis],
  )

  return (
    <Box ref={ref} sx={{ height: 400 }}>
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
        <VictoryAxis tickFormat={handleXTickFormat} />
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
