import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Collapsible from "react-collapsible";

function LocationDetails(props) {
  const select = props.select;

  const propsMapping = [
    {
      title: 'Demographic Summary',
      content: [
        { id: 'population', label: 'Population' },
        { id: 'income', label: 'Median Income' },
      ]
    },
    {
      title: 'Economic Summary',
      content: [
        { id: 'quartile', label: 'Income Quartile' },
        { id: 'inequality', label: 'Inequality % (lower is better)' },
        { id: null, label: 'Visitor time spent by quartile' },
      ]
    },
    {
      title: 'Growth Summary',
      content: [
        { id: 'ggp', label: 'GDP Growth Potential', desc: 'Economic growth is an increase in the production of economic goods and services,compared from one period of time to another... Traditionally, aggregate economic growth is measured in terms of gross national product (GNP) or gross domestic product (GDP), although alternative metrics are sometimes used.' },
        { id: 'jr', label: 'Job Resilience', desc: 'The ability to adjust to career change as it happens and,by extension, adapt to what the market demands.' },
        { id: 'bgi', label: 'Business Growth Index', desc: 'The growth rate is the measure of a company’s increase in revenue and potential to expand over a set period.' },
        { id: 'sa1_codes', label: 'Included SA1 Regions' },
      ]
    }
  ];

  const renderMetric = (metric) => {
    let value = select[metric.id];
    if (typeof value === 'number') {
      value = Math.floor(value);
    }

    return (
      <div>
        <h2 data-tip data-for={metric.id}>{metric.label}</h2>
        {metric.desc && (
          <ReactTooltip id={metric.id}>
            <strong>{metric.label}</strong>
            <div style={{maxWidth: 400}}>
              {metric.desc}
            </div>
          </ReactTooltip>
        )}
        <p>{value}</p>
      </div>
    )
  }

  return (
    <div
      style={{ overflowY: "auto" }}
      className={`sidebar-content`}
    >
      {propsMapping.map((section) => (
        <Collapsible trigger={section.title} key={section.title}>
          {section.content.map((metric) => (
            renderMetric(metric)
          ))}
        </Collapsible>
      ))}
    </div>
  )
}

LocationDetails.propsTypes = {
  select: PropTypes.shape({
    population: PropTypes.string,
    income: PropTypes.any,
    quartile: PropTypes.any,
    inequality: PropTypes.any,
    ggp: PropTypes.any,
    jr: PropTypes.any,
    bgi: PropTypes.any,
    sa1_codes: PropTypes.any,
  })
}

export default LocationDetails;
