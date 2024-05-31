import React from "react";
import { useDispatch } from "react-redux";
import {Redirect} from "react-router-dom"
import { LOGOUT } from "../../redux/modules/User/actions";

const Logout = ({}) => {
  const dispatch = useDispatch();
  dispatch({ type: LOGOUT });

  return <Redirect to="/" />;
};

export default Logout;
