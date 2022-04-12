import { combineReducers } from 'redux'

import api from './api'
import dataset from './dataset'
import search from './search'
import compare from './compare'

export default combineReducers({
  api,
  dataset,
  search,
  compare,
})
