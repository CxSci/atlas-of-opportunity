/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This file contains the configuration for each metric we want to show
 * {
 *    id:       field
 *    label:    name to show
 *    type:     chart type (bar | range | line-chart)
 *    min:      minimun for type range
 *    max:      maximun for type range, bar
 *    format:   value format (number | percent | currency)
 *    desc:     description to show with tooltip
 *    options:  cutomization for type range { minLabel, maxLabel, minColor, maxColor }
 *    generator: function to generate metrics that vary depending on their feature or features
 * }
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const mapping = [
  {
    title: 'Demographic Summary',
    content: [
      {
        id: 'pop_proj',
        label: 'Projected Population',
        type: 'line-chart'
      },
      {
        id: 'persons_num',
        label: 'Population',
        format: 'number'
      },
      {
        id: 'popfraction',
        label: 'Fraction of South Australia Population Living in this Region', // too long
        format: 'percent_normalized', // 0.42 -> 42%
      },
      {
        id: 'median_persons_age',
        label: 'Median Age of Residents',
        format: 'number',
      },
      {
        id: 'males_num',
        label: 'Male Residents',
        format: 'number',
      },
      {
        id: 'median_male_age',
        label: 'Median Age of Male Residents',
        format: 'number',
      },
      {
        id: 'females_num',
        label: 'Female Residents',
        format: 'number',
      },
      {
        id: 'median_female_age',
        label: 'Median Age of Female Residents',
        format: 'number',
      },
      {
        id: 'percentage_person_aged_0_14',
        label: 'Residents Aged 0-14',
        format: 'percent',
        type: 'bar',
      },
      {
        id: 'percentage_person_aged_15_64',
        label: 'Residents Aged 15-64',
        format: 'percent',
        type: 'bar',
      },
      {
        id: 'percentage_person_aged_65_plus',
        label: 'Residents Aged 65+',
        format: 'percent',
        type: 'bar',
      },
    ]
  },
  {
    title: 'Economic Summary',
    content: [
      {
        id: 'earners_persons',
        label: 'Number of Wage Earners',
        format: 'number',
      },
      {
        id: 'median_age_of_earners_years',
        label: 'Median Age of Wage Earners',
        format: 'number',
      },
      {
        id: 'median_aud',
        label: 'Median Income',
        format: 'currency',
      },
      {
        id: 'mean_aud',
        label: 'Mean Income',
        format: 'currency',
      },
      {
        id: 'income_aud',
        label: 'Accumulate Income', // ?
        format: 'currency',
      },
      {
        id: 'quartile',
        label: 'Income Quartile',
        type: 'bar',
        max: 4,
        // format: 'range', // One of 1, 2, 3, or 4
      },
      // {
      //   id: 'inequality',
      //   label: 'Inequality (lower is better)',
      //   format: 'percent',
      //   type: 'bar',
      //   max: 100,
      // },
      {
        id: 'occup_diversity',
        label: 'Job Resilience',
        format: 'number',
        type: 'range',
        min: 1.08, // lowest value amongst existing data
        max: 3.54, // highest value amongst existing data
      },
      {
        id: 'gini_coefficient_no',
        label: 'Income Gini Coefficient',
        // format: 'range', // from 0 to 1
        type: 'bar',
        max: 1.0,
      },
      {
        id: 'highest_quartile_pc',
        label: 'Earners in Highest Income Quartile',
        format: 'percent',
        type: 'bar',
      },
      {
        id: 'third_quartile_pc',
        label: 'Earners in Third Income Quartile',
        format: 'percent',
        type: 'bar',
      },
      {
        id: 'second_quartile_pc',
        label: 'Earners in Second Income Quartile',
        format: 'percent',
        type: 'bar',
      },
      {
        id: 'lowest_quartile_pc',
        label: 'Earners in Lowest Income Quartile',
        format: 'percent',
        type: 'bar',
      },
      {
        id: 'income_share_top_1pc',
        label: 'Income Share of Top 1% Income Group',
        format: 'percent',
        type: 'bar',
      },
      {
        id: 'income_share_top_5pc',
        label: 'Income Share of Top 5% Income Group',
        format: 'percent',
        type: 'bar',
      },
      {
        id: 'income_share_top_10pc',
        label: 'Income Share of Top 10% Income Group',
        format: 'percent',
        type: 'bar',
      },
    ]
  },
  {
    title: 'Growth Summary',
    content: [
      {
        id: 'income_diversity',
        label: 'GDP Growth Potential',
        desc: `Economic growth is an increase in the production of economic goods and services, compared from one period of time to another. Traditionally, aggregate economic growth is measured in terms of gross national product (GNP) or gross domestic product (GDP), although alternative metrics are sometimes used.`,
        format: 'number',
        type: 'range',
        min: 0,
        max: 1.2,
      },
      // {
      //   id: 'bridge_diversity',
      //   label: 'Social Bridge Diversity', // not Job Resilience?
      //   format: 'number',
      //   type: 'range',
      //   max: 5.0,
      //   options: {
      //     minLabel: 'MIN',
      //     maxLabel: 'MAX',
      //     minColor: 'rgb(89,207,245)',
      //     maxColor: 'rgb(45,156,219)',
      //   },
      // },
      // {
      //   id: 'bridge_diversity', label: 'Job Resilience', format: 'number',
      //   desc: 'The ability to adjust to career change as it happens and,by extension, adapt to what the market demands.'
      // },
      {
        id: 'bsns_entries',
        label: 'Number of Businesses Opened', // when?
        format: 'number',
      },
      {
        id: 'bsns_exits',
        label: 'Number of Businesses Closed', // when?
        format: 'number',
      },
      {
        id: 'bsns_growth_rate',
        label: 'Relative Business Growth Rate',
        format: 'percent_normalized',
      },
      // {
      //   id: 'bsns_growth_rate', label: 'Business Growth Index', format: 'number',
      //   desc: 'The growth rate is the measure of a company’s increase in revenue and potential to expand over a set period.'
      // },
    ]
  },
  {
    title: 'Residential Housing Summary',
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
  },
  {
    title: 'Financial Transactions',
    content: [
      {
        generator: (features) => {
          // Get just the keys of the features' properties.
          // If there are multiple features, merge all of their keys into one
          // list.
          const multiKeys = features.map(f => Object.keys(f.properties))
          const keys = [...new Set([].concat(...multiKeys))]

          let metrics = []
          const prefix = 'trans'

          const types = {
            'avg_spent_index': "Average Spent",
            'trx_count_index': "Transaction Count",
          }

          const categories = {
            'apparel_dept':       'Apparel Discount and Department Stores',
            'auto_transp':        'Auto and Transportation',
            'dining_sports_ent':  'Dining Sports and Entertainment',
            'hardware_homeware':  'Hardware Supplies and Homewares',
            'luxury_specialty':   'Luxury and Speciality Stores',
            'med_care':           'Medical and Personal Care',
            'personal_svcs':      'Personal Services',
            'prof_svcs':          'Professional Services',
            'grocery':            'Retail Food Grocery and Supermarkets',
            'trade_manuf':        'Trades and Light Manufacturing',
            'travel_accom_rent':  'Travel Accommodation and Rentals',
          }

          Object.keys(categories).forEach((categoryKey) => {
            Object.keys(types).forEach((typeKey) => {
              // Produces ids like:
              //   trans_avg_spent_index_apparel_dept
              //   trans_trx_count_index_apparel_dept
              const id = `${prefix}_${typeKey}_${categoryKey}`
              // Metric isn't shown if the data is missing
              if (keys.indexOf(id) !== -1) {
                metrics.push({
                  id: id,
                  // Produces labels like:
                  //   Average Spent: Apparel Discount and Department Stores
                  //   Transaction Count: Apparel Discount and Department Stores
                  label: `${types[typeKey]}: ${categories[categoryKey]}`,
                  format: 'number',
                  type: 'range',
                  min: 0.0,
                  max: 1.0,            
                })
              }
            })
          })
          return metrics
        }
      },
    ]
  },
  {
    title: 'Business Counts',
    content: [
      {
        generator: (features) => {
          // Get just the keys of the features' properties.
          // If there are multiple features, merge all of their keys into one
          // list.
          const multiKeys = features.map(f => Object.keys(f.properties))
          const keys = [...new Set([].concat(...multiKeys))]

          let metrics = []
          const prefix = 'bsns_cnt'

          const types = {
            'total': 'Total',
            // Leave finer grained buckets out until filtering and something
            // like react-virtualized is added in a future release. Otherwise,
            // this ends up adding 100+ line charts to the sidebar, which makes
            // things very slow.
            // 'emp200': '200+ Employees',
            // 'emp20_199': '20-199 Employees',
            // 'emp5_19': '5-19 Employees',
            // 'emp1_4': '1-4 Employees',
            // 'non_emp': '0 Employees',
          }

          // ANZSIC division codes and labels
          const categories = {
            'a': 'Agriculture, Forestry and Fishing',
            'b': 'Mining',
            'c': 'Manufacturing',
            'd': 'Electricity, Gas, Water and Waste Services',
            'e': 'Construction',
            'f': 'Wholesale Trade',
            'g': 'Retail Trade',
            'h': 'Accommodation and Food Services',
            'i': 'Transport, Postal and Warehousing',
            'j': 'Information Media and Telecommunications',
            'k': 'Financial and Insurance Services',
            'l': 'Rental, Hiring and Real Estate Services',
            'm': 'Professional, Scientific and Technical Services',
            'n': 'Administrative and Support Services',
            'o': 'Public Administration and Safety',
            'p': 'Education and Training',
            'q': 'Health Care and Social Assistance',
            'r': 'Arts and Recreation Services',
            's': 'Other Services',
          }

          Object.keys(categories).forEach((categoryKey) => {
            Object.keys(types).forEach((typeKey) => {
              // Produces ids like:
              //   trans_avg_spent_index_apparel_dept
              //   trans_trx_count_index_apparel_dept
              const id = `${prefix}_${categoryKey}_${typeKey}`
              // Metric isn't shown if the data is missing
              if (keys.indexOf(id) !== -1) {
                metrics.push({
                  id: id,
                  // Produces labels like:
                  //   Average Spent: Apparel Discount and Department Stores
                  //   Transaction Count: Apparel Discount and Department Stores
                  label: `${categories[categoryKey]}: ${types[typeKey]}`,
                  type: 'line-chart',
                })
              }
            })
          })
          return metrics
        }
      },
    ]
  },
  {
    title: 'Turnover vs. Cost of Sales',
    content: [
      {
        generator: (features) => {
          // Get just the keys of the features' properties.
          // If there are multiple features, merge all of their keys into one
          // list.
          const multiKeys = features.map(f => Object.keys(f.properties))
          const keys = [...new Set([].concat(...multiKeys))]

          const prefix = 'to_cos'
          const snip = prefix.length + 1

          return keys.filter(k => k.startsWith(prefix))
              .sort()
              .reduce((metrics, key) => {
            metrics.push({
              id: key,
              label: key.slice(snip), // remove prefix
              labelFormat: 'anzsic',
              format: 'number',
            })
            return metrics
          }, [])
        }
      },
    ]
  },
  {
    title: 'Business Rental Costs',
    content: [
      {
        generator: (features) => {
          // Get just the keys of the features' properties.
          // If there are multiple features, merge all of their keys into one
          // list.
          const multiKeys = features.map(f => Object.keys(f.properties))
          const keys = [...new Set([].concat(...multiKeys))]

          const prefix = 'bsns_rent'
          const snip = prefix.length + 1

          return keys.filter(k => k.startsWith(prefix))
              .sort()
              .reduce((metrics, key) => {
            metrics.push({
              id: key,
              label: key.slice(snip), // remove prefix
              labelFormat: 'anzsic',
              format: 'currency',
            })
            return metrics
          }, [])
        }
      },
    ]
  },
];

export default mapping;