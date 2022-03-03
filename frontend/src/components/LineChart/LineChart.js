import { useCallback, useMemo, useRef } from 'react'
import { useTheme } from '@mui/system'
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory'
import { useIntl } from 'react-intl'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'

import { formatTickNumber, getLineChartDomain, useVictoryTheme, useClientSize } from 'utils/victory'
import { ChartAxisType } from 'utils/propTypes'
import ChartFlyOut from 'components/ChartFlyOut'

const LINE_CHART_RATIO = 0.75

const LineChart = ({ data, title, xAxis, yAxis }) => {
  const { formatNumber } = useIntl()
  const theme = useTheme()
  const domain = useMemo(() => getLineChartDomain(data, LINE_CHART_RATIO), [data])
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
    <Box
      ref={ref}
      sx={{
        /* Required since tooltip is shown in the right column assuming it has 2 columns inheriting parent's value */
        columns: 1,
      }}>
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
        <VictoryAxis tickFormat={handleXTickFormat} />
        <VictoryAxis dependentAxis domain={domain} tickFormat={handleYTickFormat} />
        <VictoryLine data={data} />
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
