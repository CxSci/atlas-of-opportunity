export default [
  {
    title: 'Demographic Summary',
    content: [
      { id: 'fake', label: 'Fake metric', type: 'chart' },
      { id: 'persons_num', label: 'Population', format: 'number' },
      { id: 'median_aud', label: 'Median Income', format: 'currency' },
    ]
  },
  {
    title: 'Economic Summary',
    content: [
      { id: 'quartile', label: 'Income Quartile' },
      { id: 'inequality', label: 'Inequality (lower is better)', format: 'percent' },
      { id: null, label: 'Visitor time spent by quartile' },
    ]
  },
  {
    title: 'Growth Summary',
    content: [
      {
        id: 'income_diversity', label: 'GDP Growth Potential', format: 'number',
        desc: 'Economic growth is an increase in the production of economic goods and services,compared from one period of time to another... Traditionally, aggregate economic growth is measured in terms of gross national product (GNP) or gross domestic product (GDP), although alternative metrics are sometimes used.'
      },
      {
        id: 'bridge_diversity', label: 'Job Resilience', format: 'number',
        desc: 'The ability to adjust to career change as it happens and,by extension, adapt to what the market demands.'
      },
      {
        id: 'bsns_growth_rate', label: 'Business Growth Index', format: 'number',
        desc: 'The growth rate is the measure of a company’s increase in revenue and potential to expand over a set period.'
      },
    ]
  },
  {
    title: 'Housing Summary',
    content: [
      {
        id: 'housing_median_1br_apt',
        label: 'Median 1BR Apt Weekly',
        format: 'currency',
      },
      {
        id: 'housing_median_2br_apt',
        label: 'Median 2BR Apt Weekly',
        format: 'currency',
      },
      {
        id: 'housing_median_3br_apt',
        label: 'Median 3BR Apt Weekly',
        format: 'currency',
      },
      {
        id: 'housing_median_4above_apt',
        label: 'Median 4BR+ Apt Weekly',
        format: 'currency',
      },
      {
        id: 'housing_median_1br_h',
        label: 'Median 1BR House Weekly',
        format: 'currency',
      },
      {
        id: 'housing_median_2br_h',
        label: 'Median 2BR House Weekly',
        format: 'currency',
      },
      {
        id: 'housing_median_3br_h',
        label: 'Median 3BR House Weekly',
        format: 'currency',
      },
      {
        id: 'housing_median_4above_h',
        label: 'Median 4BR+ House Weekly',
        format: 'currency',
      },
    ]
  }
];
