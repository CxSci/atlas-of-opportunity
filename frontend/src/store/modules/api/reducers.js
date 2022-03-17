import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

import { REQUEST_SUCCESS, REQUEST_REJECTED, REQUEST_PENDING, SET_API_DATA, CLEAR_API_STATE } from './types'
import { prettifyMethod, deepSetWith, deepUnsetWith } from 'utils/helpers'

export const requests = handleActions(
  {
    [REQUEST_PENDING]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [prettifyMethod(payload.method)]: {
            status: REQUEST_PENDING,
          },
        },
      }
    },

    [REQUEST_SUCCESS]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [prettifyMethod(payload.method)]: {
            status: REQUEST_SUCCESS,
            footprint: payload.footprint,
          },
        },
      }
    },

    [REQUEST_REJECTED]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [prettifyMethod(payload.method)]: {
            status: REQUEST_REJECTED,
          },
        },
      }
    },

    [CLEAR_API_STATE]: () => {},
  },
  {},
)

export const data = handleActions(
  {
    [REQUEST_SUCCESS]: (state, { payload }) => {
      return deepSetWith(state, payload.selectorKey, payload.data)
    },

    [SET_API_DATA]: (state, { payload }) => {
      return deepSetWith(state, payload.selectorKey, payload.data)
    },

    [CLEAR_API_STATE]: () => {},

    [REQUEST_REJECTED]: (state, { payload }) => {
      if (prettifyMethod(payload.method) === 'get') {
        return deepUnsetWith(state, payload.selectorKey)
      }
      return state
    },
  },
  {},
)

export default combineReducers({
  data,
  requests,
})
