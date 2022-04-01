import { handleActions } from 'redux-actions'
import * as types from './types'

const initialState = {
  data: [],
}

export default handleActions(
  {
    [types.GET_SEARCH_LIST]: (state, action) => {
      console.log(action)
      return {
        data: action.payload,
      }
    },
  },
  initialState,
)
