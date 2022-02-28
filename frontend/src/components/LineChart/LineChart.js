import { PropTypes } from 'prop-types'
import { useMemo, useRef } from 'react'
import { useTheme } from '@mui/system'
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTooltip } from 'victory'
import Box from '@mui/material/Box'

import { nFormatter } from 'utils/helpers'
import { getLineChartDomain, useVictoryTheme, useClientSize } from 'utils/victory'
import ChartFlyOut from 'components/ChartFlyOut'

const LINE_CHART_RATIO = 0.75

const LineChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
  const theme = useTheme()
  const domain = useMemo(() => getLineChartDomain(data, LINE_CHART_RATIO), [data])
  const victoryTheme = useVictoryTheme(theme)

  const ref = useRef()
  const size = useClientSize(ref)

  return (
    <Box ref={ref} sx={{ columns: 1, marginTop: '-50px' }}>
      <VictoryChart {...size} theme={victoryTheme}>
        <VictoryAxis />
        <VictoryAxis dependentAxis domain={domain} tickFormat={t => nFormatter(t)} />
        <VictoryLine data={data} />
        <VictoryScatter
          data={data}
          labels={() => ''}
          labelComponent={
            <VictoryTooltip
              flyoutComponent={<ChartFlyOut title={title} xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel} />}
            />
          }
        />
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
