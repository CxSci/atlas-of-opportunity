import React, {  } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";
import Table from "rc-table";
import propsMapping from "./propsMapping";
import { formatValue } from "../utils/formatValue";
import GradientBar from "./charts/GradientBar";
import SolidBar from "./charts/SolidBar";
import "../css/TableView.css"
const { Column } = Table;

const TableView = ({comparisonFeatures}) => {
  const nameColumnWidth = 170;
  const dataColumnWidth = 120;
  const colPadding = 10 * 2;
  const tableWidth = (nameColumnWidth + colPadding) + (dataColumnWidth + colPadding) * comparisonFeatures.length;
  const columns = comparisonFeatures.map((ft, idx) => ({ 
    dataKey: `regionData${idx + 1}`,
    label: ft.properties.SA2_NAME16
  }));
  const nameColumnStyle = {
    flex: `0 1 ${nameColumnWidth}px`,
    margin: '0 10px',
  }
  const dataColumnStyle = {
    flex: `0 0 ${dataColumnWidth}px`,
    margin: '0 10px',
  }
  
  const renderTable = (section) => {
    const data = [];
    
    section.content.forEach((metric, idx) => {
      let columnValues = comparisonFeatures.map((ft, idx) => {
        let rawValue = ft.properties[metric.id];
        return ({ [`regionData${idx + 1}`]: rawValue });
      });
      columnValues.push({regionName: metric.label});
      columnValues.push({id: idx});
      const row = columnValues.reduce((prev, curr) => ({...prev, ...curr}));
      data.push(row);
    })

    const renderCell = (rawValue, record) => {
      const metric = section.content[record.id];
      const value = formatValue(rawValue, metric.format);

      switch (metric.type) {
        case 'chart':
          return <div className="fake-chart"></div>
        case 'hilo-bar':
          return <GradientBar value={rawValue} width={120} />
        case 'solid-bar':
          return <SolidBar label={value} value={rawValue} width={120} />
        default:
          return value
      }
    }

    return (
      <Table
        data={data}
        rowKey="id"
        showHeader={false}
        rowClassName="table-row"
        style={{width: tableWidth}}
      >
        <Column dataIndex='regionName' width={nameColumnWidth + colPadding} />
        {columns.map(col => (
          <Column dataIndex={col.dataKey} width={dataColumnWidth + colPadding} key={col.dataKey} render={renderCell} />
        ))}
      </Table>
    )
  }
  
  return (
    <div className="table-view">
      <div className="table-header" style={{width: tableWidth}}>
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
  comparisonFeatures: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    comparisonFeatures: state.comparisonFeatures,
  };
}

export default connect(mapStateToProps)(TableView);