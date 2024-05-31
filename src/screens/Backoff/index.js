import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
  useRouteMatch,
  Switch,
  Route,
  useHistory,
  Redirect,
  Link,
} from "react-router-dom";
import Dashboard from "./Screens/Dashboard";
import Places from "./Screens/Place";
import { Button } from "antd";

const Backoff = ({ currentUser }) => {
  const auth = currentUser.data.token;
  const match = useRouteMatch().path;


  const history = useHistory();

  useEffect(() => {
    if (currentUser.account) {
      if (!currentUser.account.is_admin) {
        history.replace("/");
      }
    }
  }, [currentUser]);

  return (
    <div>
      { auth && <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "45px 27px",
        }}
      >
        <div>
          <Link to="/backoff/dashboard"> Dashboard</Link>
          <Link style={{ marginLeft: 39 }} to="/backoff/places">
            {" "}
            Mjesta
          </Link>
        </div>
        <div>
          <Button
            type={"primary"}
            onClick={() => {
              history.push("/logout");
            }}
          >
            Odjava
          </Button>
        </div>
      </div>}
      <Switch>
        {/* Warehouses tab */}
        <Route name="dashboard" path={`${match}/dashboard`}>
          <Dashboard />
        </Route>
        <Route name="places" path={`${match}/places`}>
          <Places />
        </Route>
      </Switch>
    </div>
  );
};

const mapStateToProps = (state) => ({ currentUser: state.User.user });

export default connect(mapStateToProps, null)(Backoff);
