import { handleActions } from 'redux-actions'
import { SET_COMPARE_MENU_OPEN } from './types'

const initialState = {
  menuOpen: false,
}

export default handleActions(
  {
    [SET_COMPARE_MENU_OPEN]: (state, action) => ({
      menuOpen: action.payload,
    }),
  },
  initialState,
)
