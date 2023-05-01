import { combineReducers } from 'redux'

import api from './api'
import assistants from './assistants'
import dataset from './dataset'
import search from './search'

export default combineReducers({
  api,
  assistants,
  dataset,
  search,
})
