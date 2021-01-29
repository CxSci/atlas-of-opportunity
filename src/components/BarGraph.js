import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Bar } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { scaleLinear, scaleBand } from "@visx/scale";

let BarGraph = class BarGraph extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
  };

  render() {
    const { width, height, data } = this.props;
    const margin = { top: 20, bottom: 20, left: 20, right: 0 };

    // Then we'll create some bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // We'll make some helpers to get at the data we want
    const x = (d) => d.x;
    const y = (d) => +d.y;

    // And then scale the graph by our data
    // Compose together the scale and accessor functions to get point functions
    const compose = (scale, accessor) => (data) => scale(accessor(data));

    const xScale = scaleBand({
      range: [0, xMax],
      round: true,
      domain: data.map(x),
      padding: 0.4,
    });
    const yScale = scaleLinear({
      range: [yMax, 0],
      round: true,
      domain: [0, Math.max(...data.map(y))],
    });
    const xPoint = compose(xScale, x);
    const yPoint = compose(yScale, y);
    return (
      <svg width={width} height={height}>
        {data.map((d, i) => {
          const barHeight = yMax - yPoint(d);
          return (
            <Bar
              x={xPoint(d)}
              key={xPoint(d)}
              y={yMax - barHeight}
              height={barHeight}
              fill={"black"}
              width={xScale.bandwidth()}
              rx={4}
            />
          );
        })}
        <AxisBottom
          top={yMax + margin.top}
          scale={xScale}
          stroke={'black'}
          tickStroke={'black'}
          hideAxisLine
          tickLabelProps={() => ({
            fill: 'black',
            fontSize: 11,
            textAnchor: "middle",
          })}
        />
      </svg>
    );
  }
};

function selectToBarGraphData(select) {
  if (!select) {
    return [];
  }
  let data = [];
  Object.keys(select).forEach(function (key) {
    if (key.includes("fq")) {
      data = [...data, { x: key.replace("fq", "Q "), y: select[key] }];
    }
  });
  return data;
}

// Define the graph dimensions and margins
function mapStateToProps(state) {
  return {
    select: state.select,
    data: selectToBarGraphData(state.select),
    mapType: state.mapType,
    active: state.active,
  };
}

BarGraph = connect(mapStateToProps)(BarGraph);

export default BarGraph;
