import Header from './Header.container'
import PropTypes from 'prop-types'
import AtlasBreadcrumbs, { homeBreadcrumbLink } from '../AtlasBreadcrumbs/AtlasBreadcrumbs'
import React from 'react'
import SearchInput from './SearchInput'
import CompareBtn from './CompareBtn'

export default {
  title: 'components/Header',
  component: Header,
  argTypes: {},
}

const Template = args => <Header toggleSidebar={() => null} {...args} />

export const Plain = Template.bind({})
Plain.args = {
  config: {},
}

export const WithBackButtonAndBreadcrumbs = Template.bind({})
WithBackButtonAndBreadcrumbs.args = {
  config: {
    backRoute: '/',
    content: {
      left: <AtlasBreadcrumbs links={[homeBreadcrumbLink, { text: 'Dataset' }]} />,
      right: PropTypes.element,
    },
  },
}

export const WithSearchAndCompareButton = Template.bind({})
WithSearchAndCompareButton.args = {
  config: {
    content: {
      left: <AtlasBreadcrumbs links={[homeBreadcrumbLink]} />,
      right: (
        <>
          <SearchInput />

          <CompareBtn />
        </>
      ),
    },
  },
}
