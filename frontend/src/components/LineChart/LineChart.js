import { useCallback, useMemo, useRef } from 'react'
import { useTheme } from '@mui/system'
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryStack,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'
import { useIntl } from 'react-intl'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'

import { useVictoryTheme, useClientSize } from 'hooks/victory'
import { formatTickNumber, getStackData, STACK_COLORS } from 'utils/victory'
import { ChartAxisType } from 'utils/propTypes'
import ChartFlyOut from 'components/ChartFlyOut'

const LineChart = ({ data, title, xAxis, yAxis }) => {
  const { formatNumber } = useIntl()
  const theme = useTheme()
  const stackData = useMemo(() => getStackData(data), [data])
  const victoryTheme = useVictoryTheme(theme)
  const ref = useRef()
  const size = useClientSize(ref)

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
                flyoutComponent={<ChartFlyOut title={title} xAxisLabel={xAxis.title} yAxisLabel={yAxis.title} />}
              />
            }
          />
        }>
        <VictoryAxis fixLabelOverlap tickFormat={handleXTickFormat} />
        <VictoryAxis dependentAxis tickFormat={handleYTickFormat} />
        <VictoryStack colorScale={STACK_COLORS}>
          {stackData.map(item => (
            <VictoryLine key={item.title} data={item.data} />
          ))}
        </VictoryStack>
        <VictoryScatter data={data} />
      </VictoryChart>
    </Box>
  )
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      y: PropTypes.number.isRequired,
    }),
  ),
  title: PropTypes.string.isRequired,
  xAxis: ChartAxisType.isRequired,
  yAxis: ChartAxisType.isRequired,
}

export default LineChart
