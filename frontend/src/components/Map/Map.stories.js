import Map from './Map'

const config = {
  id: 'small-business-support',
  title: 'Small Business Support',
  type: 'map',
  options: {
    style: 'mapbox://styles/justinanderson/ckzrzxt0s000c14k55o20zjbk',
    bounds: [
      [129, -38],
      [141, -26],
    ],
    fitBoundsOptions: {
      padding: {
        top: 70,
        bottom: 70,
        left: 70,
        right: 70,
      },
    },
  },
  defaultMetric: 'income_diversity',
  metrics: [
    {
      id: 'income_diversity',
      title: 'GDP Growth Potential',
      type: 'chloropleth',
      geometry: {
        type: 'vector',
        url: 'mapbox://justinanderson.sa_2016_aust',
        promoteId: 'SA2_MAIN16',
        titleKey: 'SA2_NAME16',
      },
      data: {
        type: 'json',
        url: 'https://gist.githubusercontent.com/justinanderson/e4f894b5ab6ae5b5ee408c182ac1ff42/raw/088fcd8dfdd503dc7a116149b49b5b0f17129381/income_diversity.json',
      },
      layers: [
        {
          metric: {
            title: 'GDP Growth Potential',
            type: 'simple_range',
            domain: [0, 0.6, 1.2],
            scale: 'linear',
          },
          sourceLayer: 'sa2_2016_aust',
          beforeId: 'poi-label',
          paint: {
            default: {
              fill: {
                colorScheme: ['#fff5eb', '#fd8d3c', '#7f2704'],
                fallbackColor: '#555555',
              },
              outline: {
                color: '#ffffff',
                width: 1.2,
                opacity: 0.5,
              },
            },
            hover: {
              outline: {
                width: 2.0,
                opacity: 1.0,
              },
            },
          },
        },
      ],
    },
  ],
}

export default {
  title: 'components/Map',
  component: Map,
  argTypes: {},
}

const Template = args => <Map {...args} />

// TODO: popup not working
export const Default = Template.bind({})
Default.args = {
  config,
  hidePopup: true,
}
