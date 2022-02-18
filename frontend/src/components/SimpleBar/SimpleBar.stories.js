import SimpleBar from './SimpleBar'

export default {
  title: 'components/SimpleBar',
  component: SimpleBar,
  argTypes: {}
}

const Template = args => <SimpleBar {...args} />

export const WithPercentage = Template.bind({})
WithPercentage.args = {
  value: 0.75,
  numberFormat: {
    style: 'percent',
    maximumFractionDigits: 20
  }
}

export const WithNumber = Template.bind({})
WithNumber.args = {
  value: 5,
  percentage: 0.5
}

export const WithCurrency = Template.bind({})
WithCurrency.args = {
  value: 15363,
  percentage: 0.7,
  numberFormat: {
    style: 'currency',
    currency: 'AUD'
  }
}
