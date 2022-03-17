import { takeLatest } from 'redux-saga/effects'
import { createApiCallSaga } from '../api'
import * as Types from './types'

import sectionsData from 'mocked_api_responses/detail_data_example_small_business_support_adelaide.json' // mock data
import sectionsLayout from 'mocked_api_responses/detail_layout_example_small_business_support.json' // mock data

const getSmallBusinessDataLayout = createApiCallSaga({
  type: Types.GET_SMALL_BUSINESS_DATA_LAYOUT,
  method: 'GET',
  path: '/',
  payloadOnSuccess: () => sectionsLayout,
  selectorKey: 'smallBuinessDataLayout',
})

const getSmallBusinessDataDetail = createApiCallSaga({
  type: Types.GET_SMALL_BUSINESS_DATA_DETAIL,
  method: 'GET',
  path: '/',
  payloadOnSuccess: () => sectionsData,
  selectorKey: 'smallBusinessDataDetail',
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_SMALL_BUSINESS_DATA_DETAIL, getSmallBusinessDataDetail)
  yield takeLatest(Types.GET_SMALL_BUSINESS_DATA_LAYOUT, getSmallBusinessDataLayout)
}
