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
    return yield `/datasets/${datasetId}/detail/${entryId}/`
  },
  selectorKey: 'datasetDetailData',
})

const getDatasetGeoJSON = createApiCallSaga({
  type: Types.GET_DATASET_GEO_JSON,
  method: 'GET',
  path: function* ({ payload: { datasetId, params } }) {
    return yield `/datasets/${datasetId}/geometry/`
  },
  selectorKey: 'datasetGeoJSON',
  allowedParamKeys: ['ids', 'include_neighbors', 'format'],
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_DATASET_LIST, getDatasetList)
  yield takeLatest(Types.GET_DATASET_SINGLE, getDatasetSingle)
  yield takeLatest(Types.GET_DATASET_DETAIL_DATA, getDatasetDetailData)
  yield takeLatest(Types.GET_DATASET_GEO_JSON, getDatasetGeoJSON)
}
