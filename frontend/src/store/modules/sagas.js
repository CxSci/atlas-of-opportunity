import { all } from 'redux-saga/effects'

import { saga as smallBuiness } from './smallBusiness'

export default function* rootSaga() {
  yield all([smallBuiness()])
}
