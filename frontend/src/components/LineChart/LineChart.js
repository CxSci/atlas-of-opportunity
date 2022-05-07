import { useCallback, useMemo, useRef } from 'react'
import { useTheme } from '@mui/system'
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTooltip, VictoryVoronoiContainer } from 'victory'
import { useIntl } from 'react-intl'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'

import { useVictoryTheme, useClientSize } from 'hooks/victory'
import { formatTickNumber, getStackData, STACK_COLORS } from 'utils/victory'
import { ChartAxisType } from 'utils/propTypes'
import ChartFlyOut from 'components/ChartFlyOut'

const LineChart = ({ data, title, xAxis, yAxis }) => {
  const intl = useIntl()
  const theme = useTheme()
  const stackData = useMemo(() => getStackData(data), [data])
  const victoryTheme = useVictoryTheme(theme)
  const ref = useRef()
  const size = useClientSize(ref)

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
                flyoutComponent={<ChartFlyOut title={title} xAxisLabel={xAxis.title} yAxisLabel={yAxis.title} />}
              />
            }
          />
        }>
        <VictoryAxis fixLabelOverlap tickFormat={handleXTickFormat} />
        <VictoryAxis dependentAxis tickFormat={handleYTickFormat} />
        {stackData.map((item, idx) => (
          <VictoryLine
            style={{ data: { stroke: STACK_COLORS[idx % STACK_COLORS.length] } }}
            key={item.title}
            data={item.data}
          />
        ))}
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
