import { takeLatest, put, call, select } from "redux-saga/effects";

import axios_transport from "../../../axios/axios-transport";
import { mergeBySort } from "../../../helpers/functions";
import store from "../../store";
import { LOGOUT, PREPARE_SUCCESS } from "../User/actions";
import * as actions from "./actions";

const initialState = {
  citiesFilter: {cities:  [], citiesIds: []},
  companiesToConfirm: {
    status: "",
    data: [],
  },

  company: {
    status: "loading",
    data: {},
  },

  oneStock: {
    status: "loading",
    data: {},
  },

  updateLoadSpace: {
    status: "",
    data: {},
  },
  oneLoadSpace: {
    status: "loading",
    data: {},
  },

  updateCargo: {
    status: "",
    data: {},
  },

  panes: {
    status: "",
    data: {},
  },

  getCitiesOfCountry: {
    status: "",
    data: {
      cities: [],
      zip_codes: [],
    },
  },
  saveCargo: {
    status: "",
    data: {},
  },
  cargo: {
    status: "",
    data: { data: [], cursor: {} },
  },
  oneCargo: {
    status: "loading",
    data: {},
  },
  getMyCargo: {
    status: "",
    data: [],
  },
  saveLoadSpace: {
    status: "",
    data: {},
  },
  getMyLoadingSpaces: {
    status: "",
    data: [],
  },
  addStock: {
    status: "",
    data: {},
  },
  myStocks: {
    status: "",
    data: [],
  },
  getLoadingSpace: {
    status: "",
    data: { data: [], cursor: {} },
  },
  stock: {
    status: "",
    data: { data: [], cursor: {} },
  },
  getCompanies: {
    status: "",
    data: { data: [] },
  },

  activePaneKey: {
    cargo: "tab",
    loadingSpace: "tab",
  }, // id in panes

  panes: {
    cargo: [
      {
        id: 100000,
        name: `all_ads`, // eg.
        path: `tab`,
        key: 0,
        filters: {
          name: "",
          from: [],
          to: [],
          vehicle: {
            type: [],
            features: [],
            upgrades: [],
            min_length: "",
            max_length: "",
            min_weight: "",
            max_weight: "",
            show_blocked_users: false,
          },
          auction: false,
          period: { value: null, type: "" },
        },
        type: "default",
      },
    ],
    loadingSpace: [
      {
        id: 100000,
        name: `all_ads`, // eg.
        path: `tab`,
        key: 0,
        filters: {
          name: "",
          from: [],
          to: [],
          vehicle: {
            type: [],
            features: [],
            upgrades: [],
            min_length: "",
            max_length: "",
            min_weight: "",
            max_weight: "",
            show_blocked_users: false,
          },
          period: { value: null, type: "" },
        },
        type: "default",
      },
    ],
  },
};

export default function reducer(state = initialState, action = {}) {
  let tmp = null;
  let index = null;
  switch (action.type) {
    case actions.SET_CITIES_FILTER:
      return {
        ...state,
        citiesFilter: action.data,
      };

    case actions.COMPANIES_TO_CONFIRM:
      return {
        ...state,
        companiesToConfirm: {
          status: "loading",
          data: [],
          message: "",
        },
      };

    case actions.COMPANIES_TO_CONFIRM_SUCCESS:
      return {
        ...state,
        companiesToConfirm: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.COMPANIES_TO_CONFIRM_FAIL:
      return {
        ...state,
        companiesToConfirm: {
          status: "error",
          data: [],
          message: action.message,
        },
      };
    case actions.COMPANY:
      return {
        ...state,
        company: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.COMPANY_SUCCESS:
      return {
        ...state,
        company: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.COMPANY_FAIL:
      return {
        ...state,
        company: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.ONE_STOCK:
      return {
        ...state,
        oneStock: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.ONE_STOCK_SUCCESS:
      return {
        ...state,
        oneStock: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.ONE_STOCK_FAIL:
      return {
        ...state,
        oneStock: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.UPDATE_LOAD_SPACE:
      return {
        ...state,
        updateLoadSpace: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.UPDATE_LOAD_SPACE_SUCCESS:
      return {
        ...state,
        updateLoadSpace: {
          status: "",
          data: {},
          message: action.message,
        },
        oneLoadSpace: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.UPDATE_LOAD_SPACE_FAIL:
      return {
        ...state,
        updateLoadSpace: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.ONE_LOAD_SPACE:
      return {
        ...state,
        oneLoadSpace: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.ONE_LOAD_SPACE_SUCCESS:
      return {
        ...state,
        oneLoadSpace: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.ONE_LOAD_SPACE_FAIL:
      return {
        ...state,
        oneLoadSpace: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.UPDATE_CARGO:
      return {
        ...state,
        updateCargo: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.UPDATE_CARGO_SUCCESS:
      return {
        ...state,
        updateCargo: {
          status: "",
          data: action.data,
          message: action.message,
        },
        oneCargo: {
          status: "",
          data: action.data,
          message: "",
        },
      };

    case actions.UPDATE_CARGO_FAIL:
      return {
        ...state,
        updateCargo: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.SET_ACTIVE_KEY:
      return {
        ...state,
        activePaneKey: action.data,
      };

    case actions.PANES:
      return {
        ...state,
        panes: state.panes,
      };

    case actions.PANES_SUCCESS:
      return {
        ...state,
        panes: action.update ? action.data : state.panes,
      };

    case actions.PANES_FAIL:
      return {
        ...state,
        panes: state.panes,
      };
    case actions.GET_CITIES_OF_COUNTRY:
      return {
        ...state,
        getCitiesOfCountry: {
          status: "loading" + action.componentId,
          data: { cities: [], zip_codes: [] },
          message: "",
        },
      };

    case actions.GET_CITIES_OF_COUNTRY_SUCCESS:
      return {
        ...state,
        getCitiesOfCountry: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.GET_CITIES_OF_COUNTRY_FAIL:
      return {
        ...state,
        getCitiesOfCountry: {
          status: "error",
          data: { cities: [], zip_codes: [] },
          message: action.message,
        },
      };

    case actions.SET_ACTIVE_PANE: {
      return {
        ...state,
        activePane: action.data,
      };
    }

    case actions.SET_PANES:
      return {
        ...state,
        panes: action.data,
      };

    case actions.SET_CARGO_FILTERS:
      return {
        ...state,
        filter: action.data,
      };
    case actions.GET_COMPANIES:
      return {
        ...state,
        getCompanies: {
          status: "loading",
          data: { data: [] },
          message: "",
        },
      };

    case actions.GET_COMPANIES_SUCCESS:
      if (Array.isArray(action.data)) {
        tmp = { data: action.data };
      } else {
        tmp = action.data;
      }
      return {
        ...state,
        getCompanies: {
          status: "",
          data: tmp,
          message: action.message,
        },
      };

    case actions.GET_COMPANIES_FAIL:
      return {
        ...state,
        getCompanies: {
          status: "error",
          data: { data: [] },
          message: action.message,
        },
      };

    case actions.STOCK:
      return {
        ...state,
        stock: {
          status: "loading",
          data: { data: [], cursor: {} },
          message: "",
        },
      };

    case actions.STOCK_SUCCESS:
      return {
        ...state,
        stock: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.STOCK_FAIL:
      return {
        ...state,
        stock: {
          status: "error",
          data: { data: [], cursor: {} },
          message: action.message,
        },
      };

    case actions.GET_LOADING_SPACE:
      return {
        ...state,
        getLoadingSpace: {
          status: "loading",
          data: action.startWithEmptyArr
            ? { data: [], cursor: {} }
            : state.getLoadingSpace.data,
          message: "",
        },
      };

    case actions.GET_LOADING_SPACE_SUCCESS:
      if (Array.isArray(action.data)) {
        console.log("TU TU");
        tmp = { data: state.getLoadingSpace.data.data, cursor: {} };
      } else {
        tmp = {
          data: [...action.data.data, ...state.getLoadingSpace.data.data],
          cursor: action.data.cursor,
        };
      }
      return {
        ...state,
        getLoadingSpace: {
          status: "",
          data: tmp,
          message: action.message,
        },
      };

    case actions.GET_LOADING_SPACE_FAIL:
      return {
        ...state,
        getLoadingSpace: {
          status: "error",
          data: { data: [], cursor: {} },
          message: action.message,
        },
      };
    case actions.MY_STOCKS:
      return {
        ...state,
        myStocks: {
          status: "loading",
          data: [],
          message: "",
        },
      };

    case actions.MY_STOCKS_SUCCESS:
      return {
        ...state,
        myStocks: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.MY_STOCKS_FAIL:
      return {
        ...state,
        myStocks: {
          status: "error",
          data: [],
          message: action.message,
        },
      };
    case actions.ADD_STOCK:
      return {
        ...state,
        addStock: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.ADD_STOCK_SUCCESS:
      tmp = [...state.myStocks.data];
      tmp.push(action.data);

      return {
        ...state,
        addStock: {
          status: "",
          data: action.data,
          message: action.message,
        },
        myStocks: {
          status: "",
          data: tmp,
          message: "",
        },
      };

    case actions.ADD_STOCK_FAIL:
      return {
        ...state,
        addStock: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.GET_MY_LOADING_SPACES:
      return {
        ...state,
        getMyLoadingSpaces: {
          status: "loading",
          data: [],
          message: "",
        },
      };

    case actions.GET_MY_LOADING_SPACES_SUCCESS:
      return {
        ...state,
        getMyLoadingSpaces: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.GET_MY_LOADING_SPACES_FAIL:
      return {
        ...state,
        getMyLoadingSpaces: {
          status: "error",
          data: [],
          message: action.message,
        },
      };
    case actions.SAVE_LOAD_SPACE:
      return {
        ...state,
        saveLoadSpace: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.SAVE_LOAD_SPACE_SUCCESS:
      return {
        ...state,
        saveLoadSpace: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.SAVE_LOAD_SPACE_FAIL:
      return {
        ...state,
        saveLoadSpace: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.GET_MY_CARGO:
      return {
        ...state,
        getMyCargo: {
          status: "loading",
          data: [],
          message: "",
        },
      };

    case actions.GET_MY_CARGO_SUCCESS:
      return {
        ...state,
        getMyCargo: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.GET_MY_CARGO_FAIL:
      return {
        ...state,
        getMyCargo: {
          status: "error",
          data: [],
          message: action.message,
        },
      };
    case actions.ONE_CARGO:
      return {
        ...state,
        oneCargo: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.ONE_CARGO_SUCCESS:
      return {
        ...state,
        oneCargo: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.ONE_CARGO_FAIL:
      return {
        ...state,
        oneCargo: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.CARGO:
      return {
        ...state,
        cargo: {
          status: "loading",
          data: action.startWithEmptyArr
            ? { data: [], cursor: {} }
            : state.cargo.data,
          message: "",
        },
      };

    case actions.CARGO_SUCCESS:
      if (Array.isArray(action.data)) {
        tmp = { data: state.cargo.data.data, cursor: {} };
      } else {
        tmp = {
          data: mergeBySort([...state.cargo.data.data], action.data.data),
          cursor: action.data.cursor,
        };
      }

      return {
        ...state,
        cargo: {
          status: "",
          data: tmp,
          message: action.message,
        },
      };

    case actions.CARGO_FAIL:
      return {
        ...state,
        cargo: {
          status: "error",
          data: { data: [], cursor: {} },
          message: action.message,
        },
      };
    case actions.SAVE_CARGO:
      return {
        ...state,
        saveCargo: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.SAVE_CARGO_SUCCESS:
      return {
        ...state,
        saveCargo: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.SAVE_CARGO_FAIL:
      return {
        ...state,
        saveCargo: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    default:
      return state;
  }
}

function transformData(data) {
  return data.data;
}

const authToken = () => localStorage.getItem("token");

// saveCargo
export function* watcher_saveCargo() {
  yield takeLatest(actions.SAVE_CARGO, saveCargo);
}

function _saveCargo(options) {
  return axios_transport(options).post(`cargo/`, options.data);
}

function* saveCargo(payload) {
  try {
    const token = yield select(authToken);

    const options = {
      token: token,
      data: payload.data,
    };
    const response = yield call(_saveCargo, options);
    const data = transformData(response);
    yield put({
      type: actions.SAVE_CARGO_SUCCESS,
      data,
    });

    yield put({
      type: actions.GET_MY_CARGO_SUCCESS,
      data: [...store.getState().Transport.getMyCargo.data, data],
    });

    if (payload.renew) {
      yield put({ type: actions.ONE_CARGO_SUCCESS, data });
    }

    if (payload.successCallback) {
      payload.successCallback(data.id);
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.SAVE_CARGO_FAIL, error, message: "" });
  }
}
//saveCargo END

// cargo
export function* watcher_cargo() {
  yield takeLatest(actions.CARGO, cargo);
}

function _cargo(options) {
  return axios_transport(options).get(`cargo/`, {
    params: options.queryParams,
  });
}

function* cargo(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
    };
    const response = yield call(_cargo, options);
    const data = transformData(response);
    yield put({
      type: actions.CARGO_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.CARGO_FAIL, error, message: "" });
  }
}
//cargo END

// oneCargo
export function* watcher_oneCargo() {
  yield takeLatest(actions.ONE_CARGO, oneCargo);
}

function _oneCargo(options) {
  return axios_transport(options).get(`cargo/${options.id}`, {
    params: options.queryParams,
  });
}

function* oneCargo(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
      id: payload.id,
    };
    const response = yield call(_oneCargo, options);
    const data = transformData(response);
    yield put({
      type: actions.ONE_CARGO_SUCCESS,
      data,
      id: payload.id,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.ONE_CARGO_FAIL, error, message: "" });
  }
}
//oneCargo END

// getMyCargo
export function* watcher_getMyCargo() {
  yield takeLatest(actions.GET_MY_CARGO, getMyCargo);
}

function _getMyCargo(options) {
  return axios_transport(options).get(`get_my_cargo/`, {
    params: options.queryParams,
  });
}

function* getMyCargo(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
    };
    const response = yield call(_getMyCargo, options);
    const data = transformData(response);
    yield put({
      type: actions.GET_MY_CARGO_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_MY_CARGO_FAIL, error, message: "" });
  }
}
//getMyCargo END

// saveLoadSpace
export function* watcher_saveLoadSpace() {
  yield takeLatest(actions.SAVE_LOAD_SPACE, saveLoadSpace);
}

function _saveLoadSpace(options) {
  return axios_transport(options).post(`loading_space/`, options.data);
}

function* saveLoadSpace(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data,
    };
    const response = yield call(_saveLoadSpace, options);
    const data = transformData(response);
    yield put({
      type: actions.SAVE_LOAD_SPACE_SUCCESS,
      data,
    });

    yield put({
      type: actions.GET_MY_LOADING_SPACES_SUCCESS,
      data: [...store.getState().Transport.getMyLoadingSpaces.data, data],
    });

    if (payload.successCallback) {
      payload.successCallback(data.id);
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.SAVE_LOAD_SPACE_FAIL, error, message: "" });
  }
}
//saveLoadSpace END

// getMyLoadingSpaces
export function* watcher_getMyLoadingSpaces() {
  yield takeLatest(actions.GET_MY_LOADING_SPACES, getMyLoadingSpaces);
}

function _getMyLoadingSpaces(options) {
  return axios_transport(options).get(`get_my_loading_spaces/`, {
    params: options.queryParams,
  });
}

function* getMyLoadingSpaces(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
    };
    const response = yield call(_getMyLoadingSpaces, options);
    const data = transformData(response);
    yield put({
      type: actions.GET_MY_LOADING_SPACES_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_MY_LOADING_SPACES_FAIL, error, message: "" });
  }
}
//getMyLoadingSpaces END

// addStock
export function* watcher_addStock() {
  yield takeLatest(actions.ADD_STOCK, addStock);
}

function _addStock(options) {
  return axios_transport(options).post(`stock/`, options.data);
}

function* addStock(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data,
    };
    const response = yield call(_addStock, options);
    const data = transformData(response);
    yield put({
      type: actions.ADD_STOCK_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.ADD_STOCK_FAIL, error, message: "" });
  }
}
//addStock END

// myStocks
export function* watcher_myStocks() {
  yield takeLatest(actions.MY_STOCKS, myStocks);
}

function _myStocks(options) {
  return axios_transport(options).get(`get_my_stocks/`, {
    params: options.queryParams,
  });
}

function* myStocks(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
    };
    const response = yield call(_myStocks, options);
    const data = transformData(response);
    yield put({
      type: actions.MY_STOCKS_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.MY_STOCKS_FAIL, error, message: "" });
  }
}
//myStocks END

// getLoadingSpace
export function* watcher_getLoadingSpace() {
  yield takeLatest(actions.GET_LOADING_SPACE, getLoadingSpace);
}

function _getLoadingSpace(options) {
  return axios_transport(options).get(`loading_space/`, {
    params: options.queryParams,
  });
}

function* getLoadingSpace(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
    };
    const response = yield call(_getLoadingSpace, options);
    const data = transformData(response);
    yield put({
      type: actions.GET_LOADING_SPACE_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_LOADING_SPACE_FAIL, error, message: "" });
  }
}
//getLoadingSpace END

// stock
export function* watcher_stock() {
  yield takeLatest(actions.STOCK, stock);
}

function _stock(options) {
  return axios_transport(options).get(`stock/`, {
    params: options.queryParams,
  });
}

function* stock(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
    };
    const response = yield call(_stock, options);
    const data = transformData(response);
    yield put({
      type: actions.STOCK_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.STOCK_FAIL, error, message: "" });
  }
}
//stock END

// getCompanies
export function* watcher_getCompanies() {
  yield takeLatest(actions.GET_COMPANIES, getCompanies);
}

function _getCompanies(options) {
  return axios_transport(options).get(`companies/`, {
    params: options.queryParams,
  });
}

function* getCompanies(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
    };
    const response = yield call(_getCompanies, options);
    const data = transformData(response);
    yield put({
      type: actions.GET_COMPANIES_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_COMPANIES_FAIL, error, message: "" });
  }
}
//getCompanies END

// getCitiesOfCountry
export function* watcher_getCitiesOfCountry() {
  yield takeLatest(actions.GET_CITIES_OF_COUNTRY, getCitiesOfCountry);
}

function _getCitiesOfCountry(options) {
  return axios_transport(options).get(`cities/`, {
    params: options.queryParams,
  });
}

function* getCitiesOfCountry(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
    };
    const response = yield call(_getCitiesOfCountry, options);
    const data = transformData(response);
    yield put({
      type: actions.GET_CITIES_OF_COUNTRY_SUCCESS,
      data,
    });
    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_CITIES_OF_COUNTRY_FAIL, error, message: "" });
  }
}
//getCitiesOfCountry END

// panes
export function* watcher_panes() {
  yield takeLatest(actions.PANES, panes);
}

function _panes(options) {
  return axios_transport(options).post(`panes/`, options.data);
}

function* panes(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data,
    };
    const response = yield call(_panes, options);
    const data = transformData(response);
    yield put({
      type: actions.PANES_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.PANES_FAIL, error, message: "" });
  }
}
//panes END

// updateCargo
export function* watcher_updateCargo() {
  yield takeLatest(actions.UPDATE_CARGO, updateCargo);
}

function _updateCargo(options) {
  return axios_transport(options).put(`/cargo/${options.id}/`, options.data);
}

function* updateCargo(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data,
      id: payload.id,
    };
    const response = yield call(_updateCargo, options);
    const data = transformData(response);
    yield put({
      type: actions.UPDATE_CARGO_SUCCESS,
      data,
      id: payload.id,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.UPDATE_CARGO_FAIL, error, message: "" });
  }
}
//updateCargo END

// oneLoadSpace
export function* watcher_oneLoadSpace() {
  yield takeLatest(actions.ONE_LOAD_SPACE, oneLoadSpace);
}

function _oneLoadSpace(options) {
  return axios_transport(options).get(`/loading_space/${options.id}/`, {
    params: options.queryParams,
  });
}

function* oneLoadSpace(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
      id: payload.id,
    };
    const response = yield call(_oneLoadSpace, options);
    const data = transformData(response);
    yield put({
      type: actions.ONE_LOAD_SPACE_SUCCESS,
      data,
      id: payload.id,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.ONE_LOAD_SPACE_FAIL, error, message: "" });
  }
}
//oneLoadSpace END

// updateLoadSpace
export function* watcher_updateLoadSpace() {
  yield takeLatest(actions.UPDATE_LOAD_SPACE, updateLoadSpace);
}

function _updateLoadSpace(options) {
  return axios_transport(options).put(
    `/loading_space/${options.id}/`,
    options.data
  );
}

function* updateLoadSpace(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data,
      id: payload.id,
    };
    const response = yield call(_updateLoadSpace, options);
    const data = transformData(response);
    yield put({
      type: actions.UPDATE_LOAD_SPACE_SUCCESS,
      data,
      id: payload.id,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.UPDATE_LOAD_SPACE_FAIL, error, message: "" });
  }
}
//updateLoadSpace END

// oneStock
export function* watcher_oneStock() {
  yield takeLatest(actions.ONE_STOCK, oneStock);
}

function _oneStock(options) {
  return axios_transport(options).get(`/stock/${options.id}/`, {
    params: options.queryParams,
  });
}

function* oneStock(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
      id: payload.id,
    };
    const response = yield call(_oneStock, options);
    const data = transformData(response);
    yield put({
      type: actions.ONE_STOCK_SUCCESS,
      data,
      id: payload.id,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.ONE_STOCK_FAIL, error, message: "" });
  }
}
//oneStock END

// company
export function* watcher_company() {
  yield takeLatest(actions.COMPANY, company);
}

function _company(options) {
  return axios_transport(options).get(`/companies/${options.id}`, {
    params: options.queryParams,
  });
}

function* company(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
      id: payload.id,
    };
    const response = yield call(_company, options);
    const data = transformData(response);
    yield put({
      type: actions.COMPANY_SUCCESS,
      data,
      id: payload.id,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.COMPANY_FAIL, error, message: "" });
  }
}
//company END

// companiesToConfirm
export function* watcher_companiesToConfirm() {
  yield takeLatest(actions.COMPANIES_TO_CONFIRM, companiesToConfirm);
}

function _companiesToConfirm(options) {
  return axios_transport(options).get(`/companies_to_confirm/`, {
    params: options.queryParams,
  });
}

function* companiesToConfirm(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      queryParams: payload.queryParams,
      id: payload.id,
    };
    const response = yield call(_companiesToConfirm, options);
    const data = transformData(response);
    yield put({
      type: actions.COMPANIES_TO_CONFIRM_SUCCESS,
      data,
      id: payload.id,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback(error);
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.COMPANIES_TO_CONFIRM_FAIL, error, message: "" });
  }
}
//companiesToConfirm END
