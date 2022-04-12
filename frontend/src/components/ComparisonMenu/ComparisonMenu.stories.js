import ComparisonMenu from './ComparisonMenu'
import useCompareList from '../../hooks/useCompareList'
import { useEffect } from 'react'

export default {
  title: 'components/ComparisonMenu',
  component: ComparisonMenu,
  argTypes: {},
}

const Template = args => {
  const { comparisonList, removeFromComparison, setComparisonList } = useCompareList('Test')

  useEffect(() => {
    setComparisonList([
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
      { id: 3, title: 'Item 3' },
    ])

    return () => {
      setComparisonList([])
    }
  }, [setComparisonList])

  return <ComparisonMenu comparisonList={comparisonList} removeFromComparison={removeFromComparison} {...args} />
}

export const Default = Template.bind({})
Default.args = {}
