import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './modules'
import sagas from './modules/sagas'

// Create a history of your choosing (we're using a browser history in this case)
export const history = createBrowserHistory()

// Redux-saga middleware
const sagaMiddleware = createSagaMiddleware()

const middlewares = [sagaMiddleware]

const enhancers = [applyMiddleware(...middlewares)]

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose
/* eslint-enable */

// Also apply our middleware for navigating
export const store = createStore(rootReducer, {}, composeEnhancers(...enhancers))

sagaMiddleware.run(sagas)

export default store
