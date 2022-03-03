import Map from './Map'

export default {
  title: 'components/Map',
  component: Map,
  argTypes: {},
}

const Template = args => <Map {...args} />

// TODO: not working
export const Default = Template.bind({})
Default.args = {
  config: {},
}
