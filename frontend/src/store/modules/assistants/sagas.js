import { takeLatest } from 'redux-saga/effects'
import { createApiCallSaga } from '../api'
import * as Types from './types'

const getBusinessSimulation = createApiCallSaga({
  type: Types.GET_BUSINESS_SIMULATION,
  method: 'GET',
  path: function* ({ payload: { datasetId, params } }) {
    return yield `/datasets/${datasetId}/algorithms/simulated_poi_accessibility_score/`
  },
  selectorKey: 'businessSimulation',
  allowedParamKeys: ['cbg_geoid', 'format', 'num_new_pois', 'poi_type', 'score_type'],
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_BUSINESS_SIMULATION, getBusinessSimulation)
}
