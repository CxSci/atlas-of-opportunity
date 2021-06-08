import React from 'react';
import PropType from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';

const SolidBar = ({ width = 150, height = 24, label, value }) => {
  const data = [{
    name: label,
    value: value,
  }];

  return (
    <BarChart width={width}
      height={height}
      data={data}
      layout="vertical"
      margin={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}>
      <XAxis type="number" domain={[0, 100]} hide />
      <YAxis type="category" dataKey="name" hide />
      <Bar dataKey="value" barSize={height} fill="#ffb266" isAnimationActive={false}>
        <LabelList dataKey="name" position="insideLeft" />
      </Bar>
    </BarChart>
  );
}

SolidBar.propTypes = {
  width: PropType.number,
  height: PropType.number,
  label: PropType.string,
  value: PropType.number.isRequired,
}

export default SolidBar;
