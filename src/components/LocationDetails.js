import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Collapsible from "react-collapsible";

function LocationDetails(props) {
  const featureProps = props.feature.properties;

  const propsMapping = [
    {
      title: 'Demographic Summary',
      content: [
        { id: 'persons_num', label: 'Population' },
        { id: 'median_aud', label: 'Median Income', format: (val) => `AUD ${val}` },
      ]
    },
    {
      title: 'Economic Summary',
      content: [
        { id: 'quartile', label: 'Income Quartile' },
        { id: 'inequality', label: 'Inequality (lower is better)', format: (val) => `${val}%` },
        { id: null, label: 'Visitor time spent by quartile' },
      ]
    },
    {
      title: 'Growth Summary',
      content: [
        { id: 'income_diversity', label: 'GDP Growth Potential', desc: 'Economic growth is an increase in the production of economic goods and services,compared from one period of time to another... Traditionally, aggregate economic growth is measured in terms of gross national product (GNP) or gross domestic product (GDP), although alternative metrics are sometimes used.' },
        { id: 'bridge_diversity', label: 'Job Resilience', desc: 'The ability to adjust to career change as it happens and,by extension, adapt to what the market demands.' },
        { id: 'bsns_growth_rate', label: 'Business Growth Index', desc: 'The growth rate is the measure of a company’s increase in revenue and potential to expand over a set period.' },
        { id: 'SA1_7DIGITCODE_LIST', label: 'Included SA1 Regions' },
      ]
    }
  ];

  const renderMetric = (metric) => {
    let value = featureProps[metric.id];
    if (typeof value === 'number') {
      value = value > 10 ? Math.floor(value) : Math.floor(value * 10000) / 10000;
      value = value.toLocaleString('en-US', { minimumFractionDigits: 4 });
    }
    if (metric.format) {
      value = metric.format(value);
    }

    return (
      <div key={metric.id}>
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
  feature: PropTypes.object
}

export default LocationDetails;
