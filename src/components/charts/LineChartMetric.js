import React from 'react';
import PropType from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import { getColorFromGradient } from '../../utils/colors';
const truncate = (str, n) => (str.length > n) ? str.substr(0, n-1) + '…' : str;

const LineChartMetric = ({ width = 260, height = 140, series, data, showLegend }) => {
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

  if (showLegend) height += (lines.length * 15);

  return (
    <LineChart width={width} height={height}
      margin={{ top: 5, right: 10, left: -2, bottom: mgBottom }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" fontSize={12} allowDuplicatedCategory={false} />
      <YAxis type="number" domain={['auto','auto']}
        width={30} fontSize={12}
        tickFormatter={val => val.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 0 })} />
      <Tooltip
        contentStyle={{fontSize: 10, padding: '2px 4px'}}
        labelStyle={{display: 'none'}}
        itemStyle={{padding: 0}}
      />
      {showLegend && 
        <Legend 
          layout="vertical" />
      }
      {lines.map(line => 
        <Line key={line.key} dataKey={line.dataKey} data={line.data} name={line.name} stroke={line.color} 
          dot={false} strokeWidth={4} legendType='rect' isAnimationActive={false} />
      )}
    </LineChart>
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
