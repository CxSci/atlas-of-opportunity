import React from "react";
import PropType from "prop-types";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Scatter,
  ReferenceArea,
  Label,
} from "recharts";

const RangeBar = ({ width = 150, height = 24, value, min = 0, max = 1.2}) => {
  const data = [{
    name: "value1",
    max: max,
    value: value,
  }];

  return (
    <ComposedChart
      width={width}
      height={height}
      data={data}
      layout="vertical"
      margin={{
        top: 4,
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <XAxis type="number" domain={[min, max]} hide={true} />
      <YAxis type="category" dataKey="name" hide={true} />
      <Bar dataKey="value"
        barSize={height - 6}
        background={renderGradientShape('max')}
        shape={renderGradientShape('value')}
        isAnimationActive={false}
      />
      <Scatter dataKey="value"
        shape={renderDashedLine}
        isAnimationActive={false}
      />
      <Scatter dataKey="value"
        shape={renderTriangleShape}
        isAnimationActive={false}
      />
      <ReferenceArea x1="0" x2={data.max} fill="transparent">
        <Label value="LOW" position="insideLeft" fontSize={12} />
        <Label value="HIGH" position="insideRight" fontSize={12} />
      </ReferenceArea>
    </ComposedChart>
  )
}

RangeBar.propTypes = {
  width: PropType.number,
  height: PropType.number,
  value: PropType.number.isRequired,
  min: PropType.number,
  max: PropType.number,
}

export default RangeBar;

const renderGradientShape = (key) => {
  const component = ({ height, width, x, y, ...rest }) => {
    const gradX = rest.max / rest[key];
    const style = {
      "max": [
        { stopColor: "rgb(255,244,146)" },
        { stopColor: "rgb(249,133,133)" },
      ],
      "value": [
        { stopColor: "rgb(255,233,0)" },
        { stopColor: "rgb(242,11,11)" },
      ]
    }

    return (
      <svg x={x} y={y} key={key}>
        <defs>
          <linearGradient id={`grad-${key}`} x1="0" y1="0" x2={gradX} y2="0" >
            <stop offset="0%" style={style[key][0]} />
            <stop offset="100%" style={style[key][1]} />
          </linearGradient>
        </defs>
        <rect width={width} height={height} x={x} fill={`url(#grad-${key})`} />
      </svg>
    );
  };
  
  return component;
}

const renderTriangleShape = (props) => {
  const posX = props.x - 5;
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" x={posX} y={0}>
      <path d="M9 12L0 0L18 0L9 12Z" fill="black"/>
    </svg>
  )
}

const renderDashedLine = (props) => {
  const lineX = props.xAxis.width / 2;
  const mTop = 5;
  const lineY = props.yAxis.height + mTop;
  return (
    <line x1={lineX} y1={mTop} x2={lineX} y2={lineY} stroke="white" strokeDasharray="1 1"/>
  )
}
