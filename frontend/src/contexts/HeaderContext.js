import React from 'react'
import PropTypes from 'prop-types'

import { HeaderConfigType } from 'utils/propTypes'
export const HeaderContext = React.createContext({})

export const HeaderContextProvider = ({ headerConfig, children }) => {
  return <HeaderContext.Provider value={headerConfig}>{children}</HeaderContext.Provider>
}

HeaderContext.propTypes = {
  headerConfig: HeaderConfigType,
  children: PropTypes.node,
}

export default HeaderContext
