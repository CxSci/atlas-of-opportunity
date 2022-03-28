import { all } from 'redux-saga/effects'

import { saga as datasetSaga } from './dataset'

export default function* rootSaga() {
  yield all([datasetSaga()])
}
