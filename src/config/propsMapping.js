/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This file contains the configuration for each metric we want to show
 * {
 *    id:     field
 *    label:  name to show
 *    type:   chart type (bar | range | line-chart)
 *    min:    minimun for type range
 *    max:    maximun for type range, bar
 *    format: value format (number | percent | currency)
 *    desc:   description to show with tooltip
 * }
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export default [
  {
    title: 'Demographic Summary',
    content: [
      { id: 'pop_proj', label: 'Population Grow', type: 'line-chart' },
      { id: 'persons_num', label: 'Population', format: 'number' },
      { id: 'median_aud', label: 'Median Income', format: 'currency' },
    ]
  },
  {
    title: 'Economic Summary',
    content: [
      { id: 'quartile', label: 'Income Quartile', type: 'bar', max: 10 },
      { id: 'inequality', label: 'Inequality (lower is better)', format: 'percent', type: 'bar', max: 100 },
      { id: null, label: 'Visitor time spent by quartile' },
    ]
  },
  {
    title: 'Growth Summary',
    content: [
      {
        id: 'income_diversity', label: 'GDP Growth Potential', format: 'number', type: 'range', min: 0, max: 1.2,
        desc: 'Economic growth is an increase in the production of economic goods and services,compared from one period of time to another... Traditionally, aggregate economic growth is measured in terms of gross national product (GNP) or gross domestic product (GDP), although alternative metrics are sometimes used.'
      },
      {
        id: 'bridge_diversity', label: 'Job Resilience', format: 'number', type: 'range',
        desc: 'The ability to adjust to career change as it happens and,by extension, adapt to what the market demands.'
      },
      {
        id: 'bsns_growth_rate', label: 'Business Growth Index', format: 'number',
        desc: 'The growth rate is the measure of a company’s increase in revenue and potential to expand over a set period.'
      },
      { id: 'SA1_7DIGITCODE_LIST', label: 'Included SA1 Regions', format: 'number' },
    ]
  }
];
