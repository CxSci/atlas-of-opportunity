import { combineReducers } from 'redux'

import api from './api'
import dataset from './dataset'

export default combineReducers({
  api,
  dataset,
})
