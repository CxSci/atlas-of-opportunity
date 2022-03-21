import { takeLatest } from 'redux-saga/effects'
import { createApiCallSaga } from '../api'
import * as Types from './types'

import sectionsData from 'mocked_api_responses/detail_data_example_small_business_support_adelaide.json' // mock data
import sectionsLayout from 'mocked_api_responses/detail_layout_example_small_business_support.json' // mock data
import smallBusinessSupportData from 'mocked_api_responses/explore_layout_small_business_support.json'

const getSmallBusinessDataLayout = createApiCallSaga({
  type: Types.GET_SMALL_BUSINESS_DATA_LAYOUT,
  method: 'GET',
  path: '/', // Todo: Replace with real API endpoint URL
  payloadOnSuccess: () => sectionsLayout,
  selectorKey: 'smallBuinessDataLayout',
})

const getSmallBusinessDataDetail = createApiCallSaga({
  type: Types.GET_SMALL_BUSINESS_DATA_DETAIL,
  method: 'GET',
  path: '/', // Todo: Replace with real API endpoint URL
  payloadOnSuccess: () => sectionsData,
  selectorKey: 'smallBusinessDataDetail',
})

const getSmallBusinessSupportData = createApiCallSaga({
  type: Types.GET_SMALL_BUSINESS_SUPPORT_DATA,
  method: 'GET',
  path: '/', // Todo: Replace with real API endpoint URL
  payloadOnSuccess: () => smallBusinessSupportData,
  selectorKey: 'smallBusinessSupportData',
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_SMALL_BUSINESS_DATA_DETAIL, getSmallBusinessDataDetail)
  yield takeLatest(Types.GET_SMALL_BUSINESS_DATA_LAYOUT, getSmallBusinessDataLayout)
  yield takeLatest(Types.GET_SMALL_BUSINESS_SUPPORT_DATA, getSmallBusinessSupportData)
}
