import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { reducer, loadFeatures } from "./reducer"

const store = createStore(
    reducer,
    applyMiddleware(thunk));

// Move this fetch into an .on("sourcedata") handler in the map to make sure
// this doesn't delay the map's first display
store.dispatch(loadFeatures())

export { store };
