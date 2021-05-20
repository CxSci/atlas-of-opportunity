import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";
import { Table, Column } from "react-virtualized";
import propsMapping from "./propsMapping";
import { formatValue } from "../utils/formatValue";
import "../css/TableView.css";

const TableView = ({comparisonFeatures}) => {
  const rowHeight = 30;
  const nameColumnWidth = 200;
  const dataColumnWidth = 150;
  const columns = comparisonFeatures.map((ft, idx) => ({ 
    dataKey: `regionData${idx + 1}`,
    label: ft.properties.SA2_NAME16
  }));
  const nameColumnStyle = {
    width: nameColumnWidth,
    margin: '0 10px 0 30px',
  }
  const dataColumnStyle = {
    width: dataColumnWidth,
    marginRight: '10px',
  }
  
  const renderTable = (section) => {
    const data = [];
    const height = section.content.length * rowHeight;
    
    section.content.forEach(metric => {
      let columnValues = comparisonFeatures.map((ft, idx) => {
        let rawValue = ft.properties[metric.id];
        const value = formatValue(rawValue, metric.format);
        return ({ [`regionData${idx + 1}`]: value })
      });
      columnValues.push({regionName: metric.label});
      const row = columnValues.reduce((prev, curr) => ({...prev, ...curr}));
      data.push(row);
    })

    return (
      <Table
        headerHeight={0}
        disableHeader
        width={nameColumnWidth + dataColumnWidth * 4 + 60}
        height={height}
        rowHeight={rowHeight}
        rowGetter={({ index }) => data[index]}
        rowCount={data.length}
        rowStyle={rowStyle}
      >
        <Column label='Name' dataKey='regionName' width={nameColumnWidth} />
        {columns.map(col => (
          <Column dataKey={col.dataKey} width={dataColumnWidth} key={col.dataKey} />
        ))}
      </Table>
    )
  }

  const rowStyle = ({index}) => {
    const color = index % 2 ? '#F5F5F5' : '#FFFFFF';
    return { backgroundColor: color };
  };
  
  return (
    <div className="table-view">
      <div className="table-header">
        <div style={nameColumnStyle}></div>
        {columns.map(col => (
          <div key={col.dataKey} style={dataColumnStyle}>
            {col.label}
          </div>
        ))}
      </div>
      {propsMapping.map((section) => (
        <Collapsible trigger={section.title} key={section.title} open={true}>
          {renderTable(section)}
        </Collapsible>
      ))}
    </div>
  )
}

TableView.propTypes = {
  comparisonFeatures: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    comparisonFeatures: state.comparisonFeatures,
  };
}

export default connect(mapStateToProps)(TableView);