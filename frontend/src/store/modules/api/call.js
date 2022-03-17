import axios from 'axios'
import fp from 'lodash/fp'
import { call, put } from 'redux-saga/effects'

import { API_BASE } from 'utils/constants'
import { requestRejected, requestPending, requestSuccess } from './actions'
import { prettifyMethod } from 'utils/helpers'

const defaultHeaders = request => {
  if (!fp.isEqual(request.method, 'DELETE')) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  return {}
}

const createApiCallSaga = ({
  type,
  method, // one of 'get', 'post', 'put', 'delete'
  path,
  allowedParamKeys,
  defaultParams,
  headers,
  success, // Can be function generator to use yield
  fail, // Can be function generator to use yield
  payloadOnSuccess,
  payloadOnFail,
  requestSelectorKey: requestSelectorKeyOrFunc,
  selectorKey: selectorKeyOrFunc,
  footprint,
  footprintKeys,
}) =>
  function* (action) {
    const payload = action.payload || {}
    const {
      data,
      params,
      // useCache,
      headers: customHeaders,
      success: successCallback,
      fail: failCallback,
      pending,
      resolve,
      reject,
    } = payload

    const requestSelectorKey =
      typeof requestSelectorKeyOrFunc === 'function' ? requestSelectorKeyOrFunc(payload) : requestSelectorKeyOrFunc
    const selectorKey = typeof selectorKeyOrFunc === 'function' ? selectorKeyOrFunc(payload) : selectorKeyOrFunc
    const reqFootprint = footprintKeys ? fp.pick(payload, footprintKeys) : null

    try {
      if (pending) {
        yield pending(payload)
      }

      yield put(requestPending({ selectorKey, requestSelectorKey, method }))

      const queryParams = { ...defaultParams, ...params }

      const res = yield call(axios.request, {
        url: typeof path === 'function' ? yield path(action) : path,
        method: prettifyMethod(method),
        headers: {
          ...defaultHeaders({ method }),
          ...headers,
          ...(customHeaders ? customHeaders : {}),
        },
        data,
        params: allowedParamKeys ? fp.pick(queryParams, allowedParamKeys) : queryParams,
        baseURL: API_BASE,
      })

      const resData = payloadOnSuccess ? payloadOnSuccess(res.data, action) : res.data
      yield put(
        requestSuccess({
          footprint: reqFootprint,
          selectorKey,
          requestSelectorKey,
          method,
          type,
          data: resData,
        }),
      )

      if (resolve) {
        // Promise parameter
        yield resolve(resData)
      }

      if (success) {
        yield success(resData, action)
      }
      successCallback && successCallback(resData)

      return true
    } catch (err) {
      const errRes = fp.get(err, 'response') || err
      const payload = payloadOnFail ? payloadOnFail(errRes, action) : errRes
      yield put(
        requestRejected({
          selectorKey,
          requestSelectorKey,
          method,
          data: payload,
        }),
      )

      if (reject) {
        // Promise parameter
        yield reject(payload)
      }

      if (fail) {
        yield fail(errRes)
      }

      failCallback && failCallback(errRes)

      return false
    }
  }

export default createApiCallSaga
