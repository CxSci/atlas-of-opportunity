import ExpandableContainer from './ExpandableContainer'

export default {
  title: 'components/ExpandableContainer',
  component: ExpandableContainer,
  argTypes: {},
}

const Template = args => <ExpandableContainer {...args} />

export const Default = Template.bind({})
Default.args = {
  data: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7'],
  children: items => items.map((item, index) => <div key={index}>{item}</div>),
}
