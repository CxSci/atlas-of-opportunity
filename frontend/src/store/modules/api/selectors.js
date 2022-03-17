import fp from 'lodash/fp'
import * as types from './types'
import { prettifyMethod } from 'utils/helpers'

export const createDataSelector = (selectorKey, defaultVal = null) =>
  fp.compose(fp.defaultTo(defaultVal), fp.compose(fp.get, fp.split('.'))(selectorKey), fp.get(['api', 'data']))

export const createRequestStatusSelector = (selectorKey, method = 'get') =>
  fp.compose(
    fp.defaultTo('INIT'),
    fp.get('status'),
    fp.get(prettifyMethod(method)),
    fp.compose(fp.get, fp.split('.'))(selectorKey),
    fp.get(['api', 'requests']),
  )

export const createRequestFootprintSelector = (selectorKey, method = 'get', defaultVal = null) =>
  fp.compose(
    fp.defaultTo(null),
    fp.get('footprint'),
    fp.get(prettifyMethod(method)),
    fp.compose(fp.get, fp.split('.'))(selectorKey),
    fp.get(['api', 'requests']),
  )

export const isRequestNil = (selectorKey, method) =>
  fp.compose(fp.isEqual('INIT'), createRequestStatusSelector(selectorKey, method))

export const isRequestPending = (selectorKey, method) =>
  fp.compose(fp.isEqual(types.REQUEST_PENDING), createRequestStatusSelector(selectorKey, method))

export const isRequestSuccess = (selectorKey, method) =>
  fp.compose(fp.isEqual(types.REQUEST_SUCCESS), createRequestStatusSelector(selectorKey, method))

export const isRequestRejected = (selectorKey, method) =>
  fp.compose(fp.isEqual(types.REQUEST_REJECTED), createRequestStatusSelector(selectorKey, method))
