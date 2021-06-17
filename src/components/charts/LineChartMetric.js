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

const LineChartMetric = ({ width = 260, height = 140, data, showLegend }) => {
  const mgBottom = showLegend ? 0 : -10;
  if (showLegend) height += 40;
  
  if (data && !Array.isArray(data[0])) {
    data = [data];
  }
  
  const lines = data.map((_, idx) => ({
    dataKey: `value${idx + 1}`,
    color: getColorFromGradient('rgb(255,233,36)', 'rgb(242,11,11)', (idx + 1) / 5)
  }));
  
  const adapedData = data.reduce((prev, curr, idx) => {
    if (!prev.length) {
      prev = curr.map(x => ({ year: x.year }));
    }
    prev = prev.map((item, pos) => {
      const newItem = {...item, [`value${idx + 1}`]: curr[pos].value };
      return newItem;
    })
    return prev;
  }, []);

  return (
    <LineChart width={width} height={height} data={adapedData}
      margin={{ top: 5, right: 10, left: -2, bottom: mgBottom }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" fontSize={12} />
      <YAxis type="number" domain={['auto','auto']}
        width={30} fontSize={12}
        tickFormatter={val => val.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 0 })} />
      <Tooltip
        contentStyle={{fontSize: 10, padding: 2}}
        itemStyle={{padding: '1px 0'}} />
      {showLegend && 
        <Legend layout="vertical" />
      }
      {lines.map(line => 
        <Line key={line.dataKey} dataKey={line.dataKey} stroke={line.color} 
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
  showLegend: PropType.bool,
}

export default LineChartMetric;
