import { combineReducers } from 'redux'

import api from './api'
import smallBuiness from './smallBusiness'

export default combineReducers({
  api,
  smallBuiness,
})
