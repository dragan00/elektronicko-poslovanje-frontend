// Imports
import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

// Root reducer
import RootReducer from "./rootReducer";

// User watchers
import {
  watcher_getUser,
  watcher_login,
  watcher_logout,
  watcher_prepare,
  watcher_register,
  watcher_updateUser,
} from "./modules/User";
import {
  watcher_addStock,
  watcher_cargo,
  watcher_companiesToConfirm,
  watcher_company,
  watcher_getCitiesOfCountry,
  watcher_getCompanies,
  watcher_getLoadingSpace,
  watcher_getMyCargo,
  watcher_getMyLoadingSpaces,
  watcher_myStocks,
  watcher_oneCargo,
  watcher_oneLoadSpace,
  watcher_oneStock,
  watcher_panes,
  watcher_saveCargo,
  watcher_saveLoadSpace,
  watcher_stock,
  watcher_updateCargo,
  watcher_updateLoadSpace,
} from "./modules/Transport";

// Saga middleware
export const sagaMiddleware = createSagaMiddleware();

// Initial state
const initialState = {};
const middlewares = [thunk];

// Creating store
const createStoreWithFirebase = compose(
  applyMiddleware(...middlewares, sagaMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (f) => f
)(createStore);

// Store
const store = createStoreWithFirebase(RootReducer, initialState);

// Running auth watchers
sagaMiddleware.run(watcher_login);
sagaMiddleware.run(watcher_register);
sagaMiddleware.run(watcher_getUser);
sagaMiddleware.run(watcher_logout);
sagaMiddleware.run(watcher_saveCargo);
sagaMiddleware.run(watcher_cargo);
sagaMiddleware.run(watcher_oneCargo);
sagaMiddleware.run(watcher_getMyCargo);
sagaMiddleware.run(watcher_saveLoadSpace);
sagaMiddleware.run(watcher_getMyLoadingSpaces);
sagaMiddleware.run(watcher_addStock);
sagaMiddleware.run(watcher_myStocks);
sagaMiddleware.run(watcher_getLoadingSpace);
sagaMiddleware.run(watcher_stock);
sagaMiddleware.run(watcher_prepare);
sagaMiddleware.run(watcher_getCompanies);
sagaMiddleware.run(watcher_getCitiesOfCountry);
sagaMiddleware.run(watcher_panes);
sagaMiddleware.run(watcher_updateCargo);
sagaMiddleware.run(watcher_oneLoadSpace);
sagaMiddleware.run(watcher_updateLoadSpace);
sagaMiddleware.run(watcher_updateUser);
sagaMiddleware.run(watcher_oneStock);
sagaMiddleware.run(watcher_company);
sagaMiddleware.run(watcher_companiesToConfirm);

export const rrfProps = {
  dispatch: store.dispatch,
};

export default store;
