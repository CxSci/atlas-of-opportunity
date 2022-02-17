import SimpleBar from './SimpleBar'

export default {
  title: 'components/SimpleBar',
  component: SimpleBar,
  argTypes: {}
}

const Template = args => <SimpleBar {...args} />

export const Default = Template.bind({})
Default.args = {
  value: 75
}
