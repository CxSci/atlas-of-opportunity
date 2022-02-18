import FieldNumber from './FieldNumber'

export default {
  title: 'components/FieldNumber',
  component: FieldNumber,
  argTypes: {}
}

const Template = args => <FieldNumber {...args} />

export const WithPercentage = Template.bind({})
WithPercentage.args = {
  value: 0.75,
  numberFormat: {
    style: 'percent',
    maximumFractionDigits: 20
  },
  gutterBottom: true
}

export const WithNumber = Template.bind({})
WithNumber.args = {
  value: 5,
  gutterBottom: true
}

export const WithCurrency = Template.bind({})
WithCurrency.args = {
  value: 15363,
  percentage: 0.7,
  numberFormat: {
    style: 'currency',
    currency: 'AUD'
  },
  gutterBottom: true
}
