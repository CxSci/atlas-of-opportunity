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

let gradientId = 0;

const RangeBar = ({ width = 150, height = 24, value, min = 0, max = 1.0, options = {} }) => {
  const data = [{
    name: "value1",
    value: value,
  }];

  options = {
    // defaults
    minLabel: 'LOW',
    maxLabel: 'HIGH',
    minColor: 'rgb(255,233,0)',
    maxColor: 'rgb(242,11,11)',
    // overrides
    ...options
  }

  const { minLabel, maxLabel, minColor, maxColor } = options;

  const renderGradientShape = ({height, width, x, y, background}) => {
    const whiteLayerX = width;
    const whiteLayerWith = background.width - width;
    const id = gradientId++;
  
    return (
      <svg x={x} y={y}>
        <defs>
          <linearGradient id={`gradient-bar${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: minColor }} />
            <stop offset="100%" style={{ stopColor: maxColor }} />
          </linearGradient>
        </defs>
        <rect width={background.width} height={background.height} fill={`url(#gradient-bar${id})`} />
        <rect width={whiteLayerWith} height={height} x={whiteLayerX} fill="white" opacity="0.5" />
      </svg>
    );
  }

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
        shape={renderGradientShape}
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
      <ReferenceArea x1={min} x2={data.value} fill="transparent">
        <Label value={minLabel} position="insideLeft" fontSize={10} fontWeight={500} />
        <Label value={maxLabel} position="insideRight" fontSize={10} fontWeight={500} />
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
  options: PropType.shape({ 
    minLabel: PropType.string,
    maxLabel: PropType.string,
    minColor: PropType.string,
    maxColor: PropType.string,
  },)
}

export default RangeBar;

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
