// Redux effects
import { takeLatest, put, call, select } from "redux-saga/effects";

// Axios imports
import axios_user from "../../../axios/axios-user";
import axios_transport from "../../../axios/axios-transport";

// Store
// import store from "../../store";

// Actions
import * as actions from "./actions";
import { PANES_SUCCESS } from "../Transport/actions";
import store from "../../store";
import axios from "axios";
import { getApiEndpoint } from "../../../axios/endpoints";

// Initial state
const initialState = {
  appLang: "HR",

  updateUser: {
    status: "",
    data: {},
  },
  user: {
    status: "",
    data: {
      token: "",
      account: {},
      prepare: {
        languages: [],
        countries: [],
        goods_types: [],
        vehicle_types: [],
        vehicle_upgrades: [],
        cities: [],
        zip_codes: [],
      },
    },
  },
  register: {
    status: "",
    data: { token: "", account: {}, prepare: {} },
  },
  getUser: {
    status: "loading",
    data: { token: "", account: {}, prepare: {} },
  },

  prepare: {
    status: "loading",
    data: { languages: [], countries: [], cities: [], zip_codes: [] },
  },

  lang: "HR",
};

export default function reducer(state = initialState, action = {}) {
  // Helper variable
  // var tmp;

  switch (action.type) {
    case actions.UPDATE_USER:
      return {
        ...state,
        updateUser: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.UPDATE_USER_SUCCESS:
      return {
        ...state,
        updateUser: {
          status: "",
          data: {},
          message: action.message,
        },
        user: {
          status: "",
          data: { ...state.user.data, account: action.data.account },
          message: null,
        },
      };

    case actions.UPDATE_USER_FAIL:
      return {
        ...state,
        updateUser: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    case actions.PREPARE:
      return {
        ...state,
        prepare: {
          status: "loading",
          data: { languages: [], countries: [], cities: [], zip_codes: [] },
          message: "",
        },
      };

    case actions.PREPARE_SUCCESS:
      return {
        ...state,
        prepare: {
          status: "",
          data: { ...action.data, cities: [], zip_codes: [] },
          message: action.message,
        },
      };

    case actions.PREPARE_FAIL:
      return {
        ...state,
        prepare: {
          status: "error",
          data: { languages: [], countries: [], cities: [], zip_codes: [] },
          message: action.message,
        },
      };
    case actions.SET_LANG:
      return {
        ...state,
        lang: action.data,
      };

    case actions.GET_USER:
      return {
        ...state,
        getUser: {
          status: "loading",
          data: { token: "", account: {}, prepare: {} },
          message: "",
        },
      };

    case actions.GET_USER_SUCCESS:
      return {
        ...state,
        getUser: {
          status: "",
          data: action.data,
          message: action.message,
        },
        user: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.GET_USER_FAIL:
      return {
        ...state,
        getUser: {
          status: "error",
          data: { token: "", account: {}, prepare: {} },
          message: action.message,
        },
      };
    case actions.REGISTER:
      return {
        ...state,
        register: {
          status: "loading",
          data: {},
          message: "",
        },
      };

    case actions.REGISTER_SUCCESS:
      return {
        ...state,
        register: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.REGISTER_FAIL:
      return {
        ...state,
        register: {
          status: "error",
          data: {},
          message: action.message,
        },
      };
    // Login
    case actions.LOGIN:
      return {
        ...state,
        user: {
          status: "loading",
          data: {
            token: "",
            account: {},
            prepare: {
              languages: [],
              countries: [],
              goods_types: [],
              vehicle_types: [],
              vehicle_upgrades: [],
              cities: [],
              zip_codes: [],
            },
          },
          message: "",
        },
      };

    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        user: {
          status: "",
          data: action.data,
          message: action.message,
        },
      };

    case actions.LOGIN_FAIL:
      return {
        ...state,
        user: {
          status: "error",
          data: {
            token: "",
            account: {},
            prepare: {
              languages: [],
              countries: [],
              goods_types: [],
              vehicle_types: [],
              vehicle_upgrades: [],
              cities: [],
              zip_codes: [],
            },
          },
          message: action.message,
        },
      };

    case actions.LOGOUT_PROCEED:
      return {
        ...state,
        user: {
          status: "",
          data: {
            token: "",
            account: {},
            prepare: {
              languages: [],
              countries: [],
              goods_types: [],
              vehicle_types: [],
              vehicle_upgrades: [],
              cities: [],
              zip_codes: [],
            },
          },
          message: "",
        },
      };

    case actions.SET_APP_LANG:
      return {
        ...state,
        appLang: action.data,
      };

    default:
      return { ...state };
  }
}

function transformData(data) {
  return data.data;
}

const authToken = () => localStorage.getItem("token");

function _logout(options) {
  return axios.post(
    `${getApiEndpoint()}accounts/logout/`,
    {},
    { headers: { Authorization: "Token " + options.token } }
  );
}

export function* watcher_logout() {
  yield takeLatest(actions.LOGOUT, logout);
}
//logout
function* logout(payload) {
  try {
    const token = yield select(authToken);

    const options = {
      token,
    };

    yield localStorage.removeItem("token");
    yield localStorage.removeItem("authTime");
    yield localStorage.removeItem("user");

    if (payload.successCallback) {
      payload.successCallback();
    }
    yield put({ type: actions.LOGOUT_PROCEED });
    const response = yield call(_logout, options);
  } catch (error) {
    if (payload.errorCallback) {
      payload.errorCallback();
    }
    yield put({ type: actions.LOGOUT_PROCEED });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// login
export function* watcher_login() {
  yield takeLatest(actions.LOGIN, login);
}

function _login(options) {
  return axios_user(options).post(`auth/`, options.data);
}

function* login(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      data: payload.data,
    };
    const response = yield call(_login, options);
    const data = transformData(response);


    if (!data.message) {
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("token", data.data.token);
      yield put({
        type: actions.LOGIN_SUCCESS,
        data: data.data,
      });

      yield put({
        type: PANES_SUCCESS,
        data: {
          ...store.getState().Transport.panes,
          ...data.data.account.panes,
        },
        update: true,
      });
    } else {
      yield put({
        type: actions.LOGIN_SUCCESS,
        data: {
          token: "",
          account: {},
          prepare: {
            languages: [],
            countries: [],
            goods_types: [],
            vehicle_types: [],
            vehicle_upgrades: [],
            cities: [],
            zip_codes: [],
          },
        },
        message: "",
      });
    }

    if (payload.successCallback) {
      payload.successCallback(data.message);
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: actions.LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.LOGIN_FAIL, error, message: "" });
  }
}
//login END

// register
export function* watcher_register() {
  yield takeLatest(actions.REGISTER, register);
}

function _register(options) {
  return axios_user(options).post(`register/`, options.data);
}

function* register(payload) {
  try {
    const options = {
      data: payload.data,
    };
    const response = yield call(_register, options);
    const data = transformData(response);
    yield put({
      type: actions.REGISTER_SUCCESS,
      data,
    });

    if (!data.message) {
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("token", data.data.token);
      yield put({ type: actions.LOGIN_SUCCESS, data: data.data });
    }

    if (payload.successCallback) {
      payload.successCallback(data);
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: actions.LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.REGISTER_FAIL, error, message: "" });
  }
}
//register END

// getUser
export function* watcher_getUser() {
  yield takeLatest(actions.GET_USER, getUser);
}

function _getUser(options) {
  return axios_user(options).get(`getuser/`, {
    params: options.queryParams,
  });
}

function* getUser(payload) {
  try {
    const options = {
      queryParams: payload.queryParams,
    };
    const response = yield call(_getUser, options);
    const data = transformData(response);
    yield put({
      type: actions.GET_USER_SUCCESS,
      data,
    });

    yield put({ type: actions.LOGIN_SUCCESS, data });

    yield put({
      type: PANES_SUCCESS,
      data: { ...store.getState().Transport.panes, ...data.account.panes },
      update: true,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (payload.errorCallback) {
      payload.errorCallback();
    }
    if (error.response && error.response.status === 401) {
      yield put({ type: actions.LOGOUT });
    }

    // dispatch a failure action to the store with the error
    yield put({ type: actions.GET_USER_FAIL, error, message: "" });
  }
}
//getUser END

// prepare
export function* watcher_prepare() {
  yield takeLatest(actions.PREPARE, prepare);
}

function _prepare(options) {
  return axios_transport(options).get(`prepare/`, {
    params: options.queryParams,
  });
}

function* prepare(payload) {
  try {
    const options = {
      queryParams: payload.queryParams,
    };
    const response = yield call(_prepare, options);
    const data = transformData(response);
    yield put({
      type: actions.PREPARE_SUCCESS,
      data,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.PREPARE_FAIL, error, message: "" });
  }
}
//prepare END

// updateUser
export function* watcher_updateUser() {
  yield takeLatest(actions.UPDATE_USER, updateUser);
}

function _updateUser(options) {
  return axios.put(
    `${getApiEndpoint()}accounts/update_account/${options.id}/`,
    options.data,
    { headers: { Authorization: "Token " + options.token } }
  );
}

function* updateUser(payload) {
  try {
    const token = yield select(authToken);
    const options = {
      token: token,
      data: payload.data,
      id: payload.id,
    };
    const response = yield call(_updateUser, options);
    const data = transformData(response);
    yield put({
      type: actions.UPDATE_USER_SUCCESS,
      data,
      id: payload.id,
    });

    if (payload.successCallback) {
      payload.successCallback();
    }
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      yield put({ type: actions.LOGOUT });
    }

    if (payload.errorCallback) {
      payload.errorCallback();
    }
    // dispatch a failure action to the store with the error
    yield put({ type: actions.UPDATE_USER_FAIL, error, message: "" });
  }
}
//updateUser END
