import SimpleRange from './SimpleRange'

export default {
  title: 'components/SimpleRange',
  component: SimpleRange,
  argTypes: {},
}

const Template = args => <SimpleRange {...args} />

export const WithGradientStyle = Template.bind({})
WithGradientStyle.args = {
  value: 0.75,
  domain: [0, 1],
  variant: 'gradient',
}

export const WithSolidStyle = Template.bind({})
WithSolidStyle.args = {
  value: 0.5,
  min: 0,
  max: 1,
  style: 'solid',
  color: 'primary',
}
