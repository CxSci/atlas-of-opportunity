import React from 'react';
import PropType from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { getColorFromGradient } from '../../utils/colors';

const LineChartMetric = ({ width = 260, height = 260, data }) => {
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
      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" fontSize={12} />
      <YAxis type="number" 
        width={30} fontSize={12}
        tickFormatter={val => val.toLocaleString('en-US', { notation: 'compact' })} />
      <Legend layout="vertical" />
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
  value: PropType.number,
  max: PropType.number,
}

export default LineChartMetric;
