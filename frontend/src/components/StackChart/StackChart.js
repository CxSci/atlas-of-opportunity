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

const StackChart = ({ data, xAxis, yAxis, variant }) => {
  const intl = useIntl()
  const theme = useTheme()
  const victoryTheme = useVictoryTheme(theme)

  const ref = useRef()
  const size = useClientSize(ref)
  const modifiedDataWithDate = data.map(item => {
    if (variant === 'time_years') {
      return { ...item, x: new Date(new Date(item.x).setFullYear(2014)), year: new Date(item.x).getFullYear() }
    } else if (variant === 'time') {
      return { ...item, x: new Date(item.x) }
    }
    return item
  })
  const stackData = useMemo(() => getStackData(modifiedDataWithDate), [modifiedDataWithDate])

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
        {...(['time', 'time_years'].includes(variant) && { scale: { x: 'time', y: 'linear' } })}
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
                flyoutComponent={
                  <ChartFlyOut placement="bottom" xAxisLabel={xAxis.title} yAxisLabel={yAxis.title} variant={variant} />
                }
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
