// Imports
import { combineReducers } from "redux";

// Reducers
import User from "./modules/User";
import Transport from "./modules/Transport";
// Combining reducers
export default combineReducers({
  User,
  Transport,
});
