import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";
import Table from "rc-table";
import propsMapping from "./propsMapping";
import { formatValue } from "../utils/formatValue";
import "../css/TableView.css"
const { Column } = Table;

const TableView = ({comparisonFeatures}) => {
  const nameColumnWidth = 170;
  const dataColumnWidth = 120;
  const colPadding = 10 * 2;
  const columns = comparisonFeatures.map((ft, idx) => ({ 
    dataKey: `regionData${idx + 1}`,
    label: ft.properties.SA2_NAME16
  }));
  const nameColumnStyle = {
    width: nameColumnWidth,
    margin: '0 10px',
  }
  const dataColumnStyle = {
    width: dataColumnWidth,
    margin: '0 10px',
  }
  
  const renderTable = (section) => {
    const data = [];
    
    section.content.forEach((metric, idx) => {
      let columnValues = comparisonFeatures.map((ft, idx) => {
        let rawValue = ft.properties[metric.id];
        const value = formatValue(rawValue, metric.format);
        return ({ [`regionData${idx + 1}`]: value })
      });
      columnValues.push({regionName: metric.label});
      columnValues.push({id: idx});
      const row = columnValues.reduce((prev, curr) => ({...prev, ...curr}));
      data.push(row);
    })

    const renderCell = (value, record) => {
      const metric = section.content[record.id];
      const isChart = metric.type === 'chart';
      return (
        !isChart ? value : <div className="fake-chart"></div>
      );
    }

    return (
      <Table
        data={data}
        rowKey="id"
        showHeader={false}
        rowClassName="table-row"
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