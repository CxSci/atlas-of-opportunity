import { takeLatest } from 'redux-saga/effects'
import { createApiCallSaga } from '../api'
import * as Types from './types'

const getDatasetList = createApiCallSaga({
  type: Types.GET_DATASET_LIST,
  method: 'GET',
  path: '/datasets/',
  selectorKey: 'datasetList',
})

const getDatasetSingle = createApiCallSaga({
  type: Types.GET_DATASET_SINGLE,
  method: 'GET',
  path: function* ({ payload: { datasetId } }) {
    return yield `/datasets/${datasetId}/`
  },
  selectorKey: 'datasetSingle',
})

const getDatasetDetailData = createApiCallSaga({
  type: Types.GET_DATASET_DETAIL_DATA,
  method: 'GET',
  path: function* ({ payload: { datasetId, entryId } }) {
    return yield `/datasets/${datasetId}/detail/${entryId}`
  },
  selectorKey: 'datasetDetailData',
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_DATASET_LIST, getDatasetList)
  yield takeLatest(Types.GET_DATASET_SINGLE, getDatasetSingle)
  yield takeLatest(Types.GET_DATASET_DETAIL_DATA, getDatasetDetailData)
}
