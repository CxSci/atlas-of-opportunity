import { takeLatest } from 'redux-saga/effects'
import { createApiCallSaga } from '../api'
import * as Types from './types'

const getSearchList = createApiCallSaga({
  type: Types.GET_SEARCH_LIST,
  method: 'GET',
  path: function* ({ payload }) {
    return yield `/datasets/${payload?.datasetId}/search/`
  },
  selectorKey: 'searchList',
  allowedParamKeys: ['q'],
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_SEARCH_LIST, getSearchList)
}
