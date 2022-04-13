import React from 'react'
import { ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import Header from './Header.container'
import AtlasBreadcrumbs, { homeBreadcrumbLink } from '../AtlasBreadcrumbs/AtlasBreadcrumbs'
import SearchInput from './SearchInput'
import CompareBtn from './CompareBtn'
import initTheme from 'utils/theme'
import store from 'store'

export default {
  title: 'components/Header',
  component: Header,
  argTypes: {},
}

const Template = args => {
  const theme = initTheme('light')
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Header toggleSidebar={() => null} {...args} />
      </ThemeProvider>
    </Provider>
  )
}

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
