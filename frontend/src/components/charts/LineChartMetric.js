import React, { useState, useEffect } from 'react';
import PropType from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  Label,
} from "recharts";
import { getColorFromGradient } from '../../utils/colors';
const truncate = (str, n) => (str.length > n) ? str.substr(0, n - 1) + '…' : str;

const LineChartMetric = ({ width = 260, height = 180, series, data, showLegend }) => {
  const [loaded, setLoaded] = useState(false)
  // Force a mount/dismount of LineChart to fix Legend overlapping
  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => { setLoaded(true) }, 0);
    return () => { clearTimeout(timer); }
  }, [series]);

  const mgBottom = showLegend ? 0 : -10;

  if (data && !Array.isArray(data[0])) {
    series = [{ name: 'Line', data }];
  }

  const lines = series.map((item, idx) => ({
    key: item.name,
    dataKey: `value`,
    data: item.data,
    name: truncate(item.name, 20),
    color: getColorFromGradient('rgb(255,233,36)', 'rgb(242,11,11)', (idx + 1) / 5)
  }));
  const hasNoData = series.every(item => item.data.length === 0);

  const labelOffset = height / 2 + (showLegend ? 5 : 15);
  const legendHeight = (lines.length * 15);
  if (showLegend) {
    height += legendHeight;
  }

  const tickFormatter = (value) => {
    // Note: Change this to use Intl.NumberFormat() some day when more browsers
    //       support it.

    // Reduce to 3 significant digits.
    value = Number.parseFloat(value.toPrecision(3))

    // Reduce to 
    if (value > 1e9) {
      return (value / 1e9).toString() + 'B';
    } else if (value > 1e6) {
      return (value / 1e6).toString() + 'M';
    } else if (value > 1e3) {
      return (value / 1e3).toString() + 'K';
    } else {
      return value.toString();
    }
  }

  return (
    <div style={{ height: height }}>
      {loaded &&
        <LineChart width={width} height={height}
          margin={{ top: 5, right: 10, left: -2, bottom: mgBottom }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" fontSize={12} allowDuplicatedCategory={false}>
            {hasNoData &&
              <Label value="No data" offset={labelOffset} position="insideBottom" />
            }
          </XAxis>
          <YAxis type="number" domain={['auto','auto']}
            width={40} fontSize={12}
            tickFormatter={tickFormatter} />
          <Tooltip
            contentStyle={{ fontSize: 10, padding: '2px 4px' }}
            labelStyle={{ display: 'none' }}
            itemStyle={{ padding: 0 }}
          />
          {showLegend &&
            <Legend
              height={legendHeight}
              layout="vertical" />
          }
          {lines.map(line =>
            <Line key={line.key} dataKey={line.dataKey} data={line.data} name={line.name} stroke={line.color}
              dot={false} strokeWidth={4} legendType='rect' isAnimationActive={false} />
          )}
        </LineChart>
      }
    </div>
  );
}

LineChartMetric.propTypes = {
  width: PropType.number,
  height: PropType.number,
  label: PropType.string,
  data: PropType.array,
  series: PropType.arrayOf(
    PropType.shape({
      name: PropType.string,
      data: PropType.array,
    })
  ),
  showLegend: PropType.bool,
}

export default LineChartMetric;
