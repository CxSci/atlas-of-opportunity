import { PropTypes } from 'prop-types'
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
import Box from '@mui/material/Box'

import { useIntl } from 'react-intl'
import { getLineChartDomain, useVictoryTheme, useClientSize } from 'utils/victory'
import ChartFlyOut from 'components/ChartFlyOut'

const LINE_CHART_RATIO = 0.75

const LineChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
  const { formatNumber } = useIntl()
  const theme = useTheme()
  const domain = useMemo(() => getLineChartDomain(data, LINE_CHART_RATIO), [data])
  const victoryTheme = useVictoryTheme(theme)

  const ref = useRef()
  const size = useClientSize(ref)
  const handleTickFormat = useCallback(
    t => {
      return formatNumber(t, {
        notation: 'compact',
        compactDisplay: 'short',
      })
    },
    [formatNumber],
  )

  return (
    <Box
      ref={ref}
      sx={{ columns: 1, marginTop: '-50px', '& svg': { overflow: 'visible', position: 'relative', zIndex: 1 } }}>
      <VictoryChart
        {...size}
        theme={victoryTheme}
        containerComponent={
          <VictoryVoronoiContainer
            labels={() => ' '}
            labelComponent={
              <VictoryTooltip
                constrainToVisibleArea
                flyoutComponent={<ChartFlyOut title={title} xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel} />}
              />
            }
          />
        }>
        <VictoryAxis />
        <VictoryAxis dependentAxis domain={domain} tickFormat={handleTickFormat} />
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
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
}

export default LineChart
