import { combineReducers } from 'redux'

import api from './api'
import dataset from './dataset'
import search from './search'

export default combineReducers({
  api,
  dataset,
  search,
})
