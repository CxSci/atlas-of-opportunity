import React, {  } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CollapsibleSection from "./CollapsibleSection";
import Table from "rc-table";
import { useSelector } from "react-redux";

import { getANZSICCodes } from "../redux/getters";
import propsMapping from "../config/propsMapping";
import { formatLabel, formatValue } from "../utils/formatValue";
import RangeBar from "./charts/RangeBar";
import SolidBar from "./charts/SolidBar";
import LineChartMetric from "./charts/LineChartMetric";
import generateMetrics from "../utils/generateMetrics";
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
  const anzsicCodes = useSelector(getANZSICCodes);
  
  const renderTable = (content) => {
    const data = [];
    
    content.forEach((metric, idx) => {
      let columnValues = comparisonFeatures.map((ft, idx) => {
        let rawValue = ft.properties[metric.id];
        return ({ [`regionData${idx + 1}`]: rawValue });
      });
      columnValues.push({regionName: formatLabel(metric, anzsicCodes)});
      columnValues.push({id: idx});
      const row = columnValues.reduce((prev, curr) => ({...prev, ...curr}));
      data.push(row);
    })

    const renderCell = (rawValue, record) => {
      const metric = content[record.id];
      if (rawValue === undefined || rawValue === null) {
        return 'No data';
      }
      
      switch (metric.type) {
        case 'line-chart':{
          return <LineChartMetric data={rawValue} width={120} height={115} />
        }
        case 'range':{
          const value = rawValue || 0;
          return <RangeBar value={value} min={metric.min} max={metric.max} options={metric.options} width={120} />
        }
        case 'bar':{
          const value = formatValue(rawValue, metric.format);
          return <SolidBar label={value} value={rawValue} max={metric.max} width={120} />
        }
        default:{
          const value = formatValue(rawValue, metric.format);
          return <span className="cell-data">{value}</span>
        }
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
        <CollapsibleSection title={section.title} key={section.title}>
          {renderTable(generateMetrics(section.content, comparisonFeatures))}
        </CollapsibleSection>
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